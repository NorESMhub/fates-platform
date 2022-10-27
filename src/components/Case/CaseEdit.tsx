import axios, { AxiosResponse } from 'axios';
import React, { Fragment } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import { valueExists } from '../../utils/cases';
import { areFlatArraysEqual } from '../../utils/lodash';
import FATESParamsInputs from './FATESParamsInputs';
import HistoryInputs from './HistoryInputs';
import VariableInput from './VariableInput';

interface Props {
    initialVariables: { [key: string]: VariableValue | undefined };
    handleClose: () => void;
}

const CaseEdit = ({ initialVariables, handleClose }: Props) => {
    const [state, dispatch] = React.useContext(StoreContext);

    const [activeTab, updateActiveTab] = React.useState<VariableCategory>('case');

    const [caseInfo, updateCaseInfo] = React.useState<{ name: string; driver: ModelDriver }>({
        name: '',
        driver: state.modelInfo?.drivers[0] || 'nuopc'
    });

    const [dataFile, updateDataFile] = React.useState<File | undefined>();

    const [variables, updateVariables] = React.useState(initialVariables);
    const [variablesErrors, updateVariablesErrors] = React.useState<{ [key: string]: string[] }>({});

    const [serverErrors, updateServerErrors] = React.useState<HTTPError>('');

    const isCustomSite = !state.selectedSite;

    const pftIndexCount = (state.selectedSite?.config?.find((v) => v.name === 'pft_index_count')?.value ||
        state.variablesConfig.find(({ name }) => name === 'pft_index_count')?.default) as number | undefined;

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

        if (variables.user_nl_clm_extra) {
            preparedVariables.push({
                name: 'user_nl_clm_extra',
                value: variables.user_nl_clm_extra
            });
        }

        dispatch({
            type: 'updateLoadingState',
            isLoading: true
        });
        updateServerErrors('');
        if (isCustomSite) {
            const formData = new FormData();
            formData.append(
                'case_attrs',
                JSON.stringify({
                    name: caseInfo.name,
                    driver: caseInfo.driver,
                    compset: '2000_DATM%GSWP3v1_CLM51%FATES_SICE_SOCN_MOSART_SGLC_SWAV',
                    variables: preparedVariables
                })
            );
            formData.append('data_file', dataFile as File);
            axios
                .post<CaseWithTaskInfo, AxiosResponse<CaseWithTaskInfo>, FormData>(`${API_PATH}/cases/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                .then(({ data }) => {
                    dispatch({
                        type: 'updateCase',
                        case: data
                    });
                    dispatch({
                        type: 'updateCustomSites',
                        action: 'add',
                        site: {
                            lat: data.lat,
                            lon: data.lon
                        }
                    });
                    handleClose();
                })
                .catch(({ response: { data } }) => {
                    updateServerErrors(data);
                })
                .finally(() => {
                    dispatch({
                        type: 'updateLoadingState',
                        isLoading: false
                    });
                });
        } else {
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
                        type: 'updateCase',
                        case: data
                    });
                    handleClose();
                })
                .catch(({ response: { data } }) => {
                    updateServerErrors(data);
                })
                .finally(() => {
                    dispatch({
                        type: 'updateLoadingState',
                        isLoading: false
                    });
                });
        }
    };

    return (
        <Dialog sx={{ alignItems: 'flex-start' }} open fullWidth maxWidth={false} scroll="paper" onClose={handleClose}>
            <DialogTitle>Create Case</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    {isCustomSite && !dataFile ? (
                        <Alert severity="warning">You must upload a data file to create a custom site.</Alert>
                    ) : null}
                    {isCustomSite && dataFile ? (
                        <Alert
                            severity="info"
                            action={
                                <Button color="inherit" size="small" onClick={() => updateDataFile(undefined)}>
                                    Remove
                                </Button>
                            }
                        >
                            Using {dataFile.name}
                        </Alert>
                    ) : null}
                    {serverErrors || Object.values(variablesErrors).some((errors) => errors.length > 0) ? (
                        <Alert severity="error">
                            <Typography variant="subtitle2">
                                {Array.isArray(serverErrors)
                                    ? serverErrors.map((error) => <Fragment key={error.msg}>{error.msg}</Fragment>)
                                    : JSON.stringify(serverErrors)}
                                {Object.entries(variablesErrors).map(([variableName, errors]) => (
                                    <Fragment key={variableName}>
                                        {errors.map((error) => (
                                            <Fragment key={error}>{error}</Fragment>
                                        ))}
                                    </Fragment>
                                ))}
                            </Typography>
                        </Alert>
                    ) : null}
                </Stack>
                <Tabs value={activeTab} onChange={(_e, tab) => updateActiveTab(tab)}>
                    <Tab label="Case" value="case" />
                    <Tab label="Run environment" value="xml_var" />
                    <Tab label="CLM namelist" value="user_nl_clm" />
                    <Tab label="History files" value="user_nl_clm_history_file" />
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
                                    options={state.modelInfo?.drivers || []}
                                    filterSelectedOptions
                                    renderInput={(params) => <TextField {...params} size="small" margin="dense" />}
                                    value={caseInfo.driver}
                                    onChange={(_event, newValue) => {
                                        updateCaseInfo({
                                            ...caseInfo,
                                            driver: newValue as ModelDriver
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
                                        errors={variablesErrors[variableConfig.name] || []}
                                        onErrors={(errors: string[]) =>
                                            updateVariablesErrors({
                                                ...variablesErrors,
                                                [variableConfig.name]: errors
                                            })
                                        }
                                        onChange={(newValue) => handleVariableChange(variableConfig.name, newValue)}
                                    />
                                </React.Fragment>
                            );
                        })}
                    {activeTab === 'user_nl_clm' ? (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={
                                    <Icon baseClassName="icons" fontSize="inherit">
                                        expand_more
                                    </Icon>
                                }
                            >
                                <Typography>Advanced</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Alert severity="warning">
                                    <Typography variant="subtitle2">
                                        Use this on your own risk.
                                        <br />
                                        Each line must be a valid namelist entry. Invalid entries can cause the model to
                                        fail.
                                    </Typography>
                                </Alert>
                                <Typography sx={{ m: 1 }}>Extra CLM namelist entries</Typography>
                                <TextareaAutosize
                                    style={{ width: '100%' }}
                                    minRows={7}
                                    value={variables.user_nl_clm_extra?.toString()}
                                    onChange={(e) => handleVariableChange('user_nl_clm_extra', e.target.value)}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ) : null}
                    {activeTab === 'user_nl_clm_history_file' ? (
                        <HistoryInputs
                            variables={variables}
                            handleVariableChange={handleVariableChange}
                            handleVariableErrors={(name: string, errors: string[]) =>
                                updateVariablesErrors({
                                    ...variablesErrors,
                                    [name]: errors
                                })
                            }
                        />
                    ) : null}
                    {activeTab === 'fates' && pftIndexCount ? (
                        <FATESParamsInputs
                            pftIndexCount={pftIndexCount}
                            variables={variables}
                            handleVariableChange={handleVariableChange}
                            handleVariableErrors={(name, errors) => {
                                updateVariablesErrors({
                                    ...variablesErrors,
                                    [name]: errors
                                });
                            }}
                        />
                    ) : null}
                </Box>
            </DialogContent>
            <DialogActions>
                {isCustomSite ? (
                    <Button component="label" sx={{ mr: 1 }} variant="outlined" color="primary">
                        Upload Data Zip File
                        <input
                            hidden
                            accept="application/zip"
                            type="file"
                            onChange={(e) => updateDataFile(e.target.files?.[0])}
                        />
                    </Button>
                ) : null}
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={
                        (isCustomSite && !dataFile) ||
                        Object.values(variablesErrors).some((errors) => errors.length > 0)
                    }
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CaseEdit;
