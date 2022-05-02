import axios, { AxiosResponse } from 'axios';
import React, { Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import { valueExists } from '../../utils/cases';
import FATESParamsInputs from './FATESParamsInputs';
import HistoryFieldInputs from './HistoryFieldInputs';
import VariableInput from './VariableInput';

const useStyles = makeStyles({
    dialogContainer: {
        alignItems: 'flex-start'
    }
});

interface Props {
    initialVariables: { [key: string]: VariableValue | undefined };
    handleClose: () => void;
}

const CaseEdit = ({ initialVariables, handleClose }: Props) => {
    const classes = useStyles();

    const { state, dispatch } = React.useContext(StateContext);

    const [activeTab, updateActiveTab] = React.useState<VariableCategory>('ctsm_xml');

    const [variables, updateVariables] = React.useState(initialVariables);
    const [variablesErrors, updateVariablesErrors] = React.useState<{ [key: string]: boolean }>({});

    const [serverErrors, updateServerErrors] = React.useState<HTTPError>('');

    const pftIndexCount = state.selectedSite?.config?.find((v) => v.name === 'pft_index_count')?.value as
        | number
        | undefined;

    React.useEffect(() => {
        if (!variables.included_pft_indices) {
            updateVariables({
                ...variables,
                included_pft_indices: [...Array(pftIndexCount).keys()].map((i) => (i + 1).toString(10))
            });
        } else {
            updateVariables(initialVariables);
        }
    }, [initialVariables]);

    const handleVariableChange = (name: string, value?: VariableValue) => {
        updateVariables({
            ...variables,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const preparedVariables: CaseVariable[] = state.variablesConfig
            .map((variableConfig) => {
                const defaultValue =
                    state.selectedSite?.config?.find((variable) => variable.name === variableConfig.name)?.value ||
                    variableConfig.default;
                let value = valueExists(variables[variableConfig.name]) ? variables[variableConfig.name] : defaultValue;
                if (variableConfig.category === 'fates_param' && value) {
                    const fatesParamDefaultValue = defaultValue as number[];
                    value = (value as Array<string | number>).map((v, idx) =>
                        parseFloat((v || (fatesParamDefaultValue[idx] as number)).toString(10))
                    );
                }
                return {
                    name: variableConfig.name,
                    value
                } as CaseVariable;
            })
            .filter((variable) => valueExists(variable.value));
        axios
            .post<CaseWithTaskInfo, AxiosResponse<CaseWithTaskInfo>, CaseEditPayload>(`${API_PATH}/sites/`, {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                site_name: state.selectedSite!.name,
                variables: preparedVariables,
                driver: 'mct'
            })
            .then(({ data }) => {
                const cases = state.selectedSiteCases;
                if (cases) {
                    const editedCaseIdx = cases.findIndex((c) => c.id === data.id);
                    if (editedCaseIdx !== -1) {
                        dispatch({
                            type: 'updateSelectedSiteCases',
                            cases: cases
                                .slice(0, editedCaseIdx)
                                .concat(data)
                                .concat(cases.slice(editedCaseIdx + 1))
                        });
                    } else {
                        dispatch({
                            type: 'updateSelectedSiteCases',
                            cases: [...cases, data]
                        });
                    }
                } else {
                    // This should never happen
                    console.error('No cases found');
                }
                handleClose();
            })
            .catch(({ response: { data } }) => {
                updateServerErrors(data);
            });
    };

    return (
        <Dialog
            classes={{ container: classes.dialogContainer }}
            open
            fullWidth
            maxWidth={false}
            scroll="paper"
            onClose={handleClose}
        >
            <DialogTitle>Create Case</DialogTitle>
            <DialogContent>
                {serverErrors ? (
                    <Alert severity="error" onClose={() => updateServerErrors('')}>
                        <Typography variant="subtitle2">
                            {Array.isArray(serverErrors)
                                ? serverErrors.map((error) => <Fragment key={error.msg}>{error.msg}</Fragment>)
                                : serverErrors}
                        </Typography>
                    </Alert>
                ) : null}
                <Tabs value={activeTab} onChange={(_e, tab) => updateActiveTab(tab)}>
                    <Tab label="CTSM" value="ctsm_xml" />
                    <Tab label="Namelist - CLM" value="user_nl_clm" />
                    <Tab label="FATES" value="fates" />
                </Tabs>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
                    {state.variablesConfig
                        .filter(
                            (variableConfig) =>
                                variableConfig.category === activeTab &&
                                !variableConfig.hidden &&
                                !variableConfig.count_depends_on &&
                                variableConfig.category !== 'fates_param' &&
                                variableConfig.name !== 'included_pft_indices'
                        )
                        .map((variableConfig) => {
                            const value = variables[variableConfig.name];
                            return (
                                <React.Fragment key={variableConfig.name}>
                                    <VariableInput
                                        key={variableConfig.name}
                                        variable={variableConfig}
                                        value={value}
                                        onErrors={(errors: string[]) =>
                                            updateVariablesErrors({
                                                ...variablesErrors,
                                                [variableConfig.name]: errors.length > 0
                                            })
                                        }
                                        onChange={(newValue) => handleVariableChange(variableConfig.name, newValue)}
                                    />
                                    {variableConfig.name.startsWith('hist_fincl') &&
                                    (variables[variableConfig.name] as string[] | undefined)?.length ? (
                                        <HistoryFieldInputs
                                            parentVariable={variableConfig}
                                            parentVariableValue={value as string[]}
                                            variables={variables}
                                            handleVariableChange={handleVariableChange}
                                            handleVariableErrors={(name, hasError) => {
                                                updateVariablesErrors({
                                                    ...variablesErrors,
                                                    [name]: hasError
                                                });
                                            }}
                                        />
                                    ) : null}
                                </React.Fragment>
                            );
                        })}
                    {activeTab === 'fates' && pftIndexCount ? (
                        <FATESParamsInputs
                            pftIndexCount={pftIndexCount}
                            variables={variables}
                            handleVariableChange={handleVariableChange}
                            handleVariableErrors={(name, hasError) => {
                                updateVariablesErrors({
                                    ...variablesErrors,
                                    [name]: hasError
                                });
                            }}
                        />
                    ) : null}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={Object.values(variablesErrors).some((hasError) => hasError)}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CaseEdit;
