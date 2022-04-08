import axios, { AxiosResponse } from 'axios';
import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { StateContext } from '../../store';
import VariableInput from './VariableInput';

interface Props {
    initialVariables: { [key: string]: VariableValue | undefined };
    handleClose: () => void;
}

const CaseEdit = ({ initialVariables, handleClose }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

    const [variables, updateVariables] = React.useState(initialVariables);

    const [errors, updateErrors] = React.useState<string>('');

    React.useEffect(() => {
        updateVariables(initialVariables);
    }, [initialVariables]);

    const handleVariableChange = (name: string, value?: VariableValue) => {
        updateVariables({
            ...variables,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const preparedVariables: CaseVariable[] = [];
        state.variablesConfig.forEach((variableConfig) => {
            const value = variables[variableConfig.name];
            if (value !== undefined) {
                preparedVariables.push({
                    ...variableConfig,
                    value
                });
            }
        });
        axios
            .post<CaseWithTaskInfo, AxiosResponse<CaseWithTaskInfo>, CaseEditPayload>(`${API_PATH}/sites`, {
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
            .catch((err) => {
                updateErrors(err.response?.data.message);
            });
    };

    return (
        <Dialog open fullWidth maxWidth={false} onClose={handleClose}>
            <DialogTitle>Create Case</DialogTitle>
            <DialogContent>
                {errors ? (
                    <Alert severity="error" onClose={() => updateErrors('')}>
                        {errors}
                    </Alert>
                ) : null}
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
                    {state.variablesConfig.map((variableConfig) => (
                        <VariableInput
                            key={variableConfig.name}
                            variable={variableConfig}
                            value={variables[variableConfig.name]}
                            onChange={(value) => handleVariableChange(variableConfig.name, value)}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CaseEdit;
