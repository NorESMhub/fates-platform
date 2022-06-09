import axios, { AxiosResponse } from 'axios';
import React, { Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import { valueExists } from '../../utils/cases';
import { areFlatArraysEqual } from '../../utils/lodash';
import FATESParamsInputs from './FATESParamsInputs';
import HistoryInputs from './HistoryInputs';
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

    const [state, dispatch] = React.useContext(StoreContext);

    React.useEffect(() => {
        dispatch({ type: 'updateCaseEditStatus', isEditingCase: true });
        return () => {
            dispatch({ type: 'updateCaseEditStatus', isEditingCase: false });
        };
    }, []);

    const [activeTab, updateActiveTab] = React.useState<VariableCategory>('case');

    const [caseInfo, updateCaseInfo] = React.useState<{ name: string; driver: CTSMDriver }>({
        name: '',
        driver: state.ctsmInfo?.drivers[0] || 'mct'
    });

    const [variables, updateVariables] = React.useState(initialVariables);
    const [variablesErrors, updateVariablesErrors] = React.useState<{ [key: string]: boolean }>({});

    const [serverErrors, updateServerErrors] = React.useState<HTTPError>('');

    const pftIndexCount = state.selectedSite?.config?.find((v) => v.name === 'pft_index_count')?.value as
        | number
        | undefined;

    React.useEffect(() => {
        if (!initialVariables.included_pft_indices) {
            updateVariables({
                ...initialVariables,
                included_pft_indices: [...Array(pftIndexCount).keys()].map((i) => (i + 1).toString(10))
            });
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (areFlatArraysEqual(value, fatesParamDefaultValue)) {
                        value = undefined;
                    }
                }

                if (
                    variableConfig.category === 'user_nl_clm_history_file' &&
                    !variableConfig.name.startsWith('hist_finc')
                ) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (areFlatArraysEqual(value, defaultValue)) {
                        value = undefined;
                    }
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
                case_name: caseInfo.name,
                variables: preparedVariables,
                driver: caseInfo.driver
            })
            .then(({ data }) => {
                dispatch({
                    type: 'updateSelectedSiteCase',
                    case: data
                });
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
                    <Tab label="Case" value="case" />
                    <Tab label="CTSM" value="ctsm_xml" />
                    <Tab label="Namelist - CLM" value="user_nl_clm" />
                    <Tab label="Namelist - CLM - History" value="user_nl_clm_history_file" />
                    <Tab label="FATES" value="fates" />
                </Tabs>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
                    {activeTab === 'case' ? (
                        <>
                            <FormControl size="small" margin="normal">
                                <TextField
                                    label="Case Name"
                                    size="small"
                                    margin="dense"
                                    value={caseInfo.name}
                                    onChange={(e) =>
                                        updateCaseInfo({
                                            ...caseInfo,
                                            name: e.target.value
                                        })
                                    }
                                />
                            </FormControl>
                            <FormControl size="small" margin="normal">
                                <Autocomplete
                                    options={state.ctsmInfo?.drivers || []}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} size="small" margin="dense" />}
                                    value={caseInfo.driver}
                                    onChange={(_event, newValue) => {
                                        updateCaseInfo({
                                            ...caseInfo,
                                            driver: newValue as CTSMDriver
                                        });
                                    }}
                                />
                            </FormControl>
                        </>
                    ) : null}
                    {state.variablesConfig
                        .filter(
                            (variableConfig) =>
                                variableConfig.category === activeTab &&
                                !variableConfig.hidden &&
                                variableConfig.category !== 'user_nl_clm_history_file' &&
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
                                </React.Fragment>
                            );
                        })}
                    {activeTab === 'user_nl_clm_history_file' ? (
                        <HistoryInputs
                            variables={variables}
                            handleVariableChange={handleVariableChange}
                            handleVariableErrors={(name: string, hasError: boolean) =>
                                updateVariablesErrors({
                                    ...variablesErrors,
                                    [name]: hasError
                                })
                            }
                        />
                    ) : null}
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
