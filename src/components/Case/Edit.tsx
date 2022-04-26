import axios, { AxiosResponse } from 'axios';
import React, { Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
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
            .map(
                (variableConfig) =>
                    ({
                        name: variableConfig.name,
                        value:
                            variables[variableConfig.name] !== undefined
                                ? variables[variableConfig.name]
                                : state.selectedSite?.config?.find((variable) => variable.name === variableConfig.name)
                                      ?.value || variableConfig.default
                    } as CaseVariable)
            )
            .filter((variable) => variable.value !== undefined && variable.value !== null && variable.value !== '');
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
                                variableConfig.category !== 'fates_param' &&
                                variableConfig.name !== 'included_pft_indices'
                        )
                        .map((variableConfig) => (
                            <VariableInput
                                key={variableConfig.name}
                                variable={variableConfig}
                                value={variables[variableConfig.name]}
                                handleError={(hasError: boolean) =>
                                    updateVariablesErrors({ ...variablesErrors, [variableConfig.name]: hasError })
                                }
                                onChange={(value) => handleVariableChange(variableConfig.name, value)}
                            />
                        ))}
                    {activeTab === 'fates' ? (
                        <Box>
                            <Typography variant="h6">FATES Parameters</Typography>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" size="small">
                                            Indices
                                        </TableCell>
                                        {[...Array(pftIndexCount).keys()].map((idx) => {
                                            const idxStr = (idx + 1).toString(10);
                                            return (
                                                <TableCell key={idx} align="center" size="small">
                                                    <Checkbox
                                                        checked={(variables.included_pft_indices as string[]).includes(
                                                            idxStr
                                                        )}
                                                        onChange={(e) => {
                                                            const newValue = new Set(
                                                                variables.included_pft_indices as string[]
                                                            );
                                                            if (e.target.checked) {
                                                                newValue.add(idxStr);
                                                            } else {
                                                                newValue.delete(idxStr);
                                                            }
                                                            handleVariableChange(
                                                                'included_pft_indices',
                                                                Array.from(newValue)
                                                            );
                                                        }}
                                                    />
                                                    {idx + 1}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.variablesConfig
                                        .filter(
                                            (variableConfig) =>
                                                variableConfig.category === 'fates_param' && !variableConfig.hidden
                                        )
                                        .map((variableConfig) => (
                                            <TableRow key={variableConfig.name}>
                                                <VariableInput
                                                    variable={variableConfig}
                                                    pftIndexCount={pftIndexCount}
                                                    value={variables[variableConfig.name]}
                                                    handleError={(hasError: boolean) =>
                                                        updateVariablesErrors({
                                                            ...variablesErrors,
                                                            [variableConfig.name]: hasError
                                                        })
                                                    }
                                                    onChange={(value) =>
                                                        handleVariableChange(variableConfig.name, value)
                                                    }
                                                />
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
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
