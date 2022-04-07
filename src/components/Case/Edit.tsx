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
import CTSMVarInput from './CTSMVarInput';

interface Props {
    initialVariables: CaseAllowedVariable[];
    handleClose: () => void;
}

const CaseEdit = ({ initialVariables, handleClose }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

    const [variables, updateVariables] = React.useState<CaseAllowedVariable[]>(initialVariables);

    const [errors, updateErrors] = React.useState<string>('');

    React.useEffect(() => {
        updateVariables(initialVariables);
    }, [initialVariables]);

    const handleVarChange = (name: string, value?: CTSMVarValue) => {
        const varIdx = variables.findIndex((v) => v.name === name);
        if (varIdx === -1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            updateVariables([...variables, { ...state.allowedVars.find((v) => v.name === name)!, value }]);
        } else {
            updateVariables([
                ...variables.slice(0, varIdx),
                {
                    ...variables[varIdx],
                    value
                },
                ...variables.slice(varIdx + 1)
            ]);
        }
    };

    const handleSubmit = () => {
        const preparedVariables: CaseAllowedVariable[] = [];
        state.allowedVars.forEach((allowedVar) => {
            const variable = variables.find((v) => v.name === allowedVar.name);
            if (variable !== undefined && variable.value !== undefined) {
                preparedVariables.push({
                    ...allowedVar,
                    value: variable.value
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
                    {state.allowedVars.map((allowedVar) => (
                        <CTSMVarInput
                            key={allowedVar.name}
                            variable={allowedVar}
                            value={variables.find((v) => v.name === allowedVar.name)?.value}
                            onChange={(value) => handleVarChange(allowedVar.name, value)}
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
