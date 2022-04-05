import axios from 'axios';
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
    initialVariables: CTSMVars;
    handleClose: () => void;
}

const CaseEdit = ({ initialVariables, handleClose }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

    const [variables, updateVariables] = React.useState<CTSMVars>(initialVariables);

    const [errors, updateErrors] = React.useState<string>('');

    React.useEffect(() => {
        updateVariables(initialVariables);
    }, [initialVariables]);

    const handleVarChange = (key: string, value?: CTSMVarValue) => {
        updateVariables({ ...variables, [key]: value });
    };

    const handleSubmit = () => {
        axios
            .post(`${API_PATH}/sites`, {
                site_name: state.selectedSite?.name,
                variables,
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
                updateErrors(err.response.data.message);
            });
    };

    return (
        <Dialog open fullWidth onClose={handleClose}>
            <DialogTitle>Create Case</DialogTitle>
            <DialogContent>
                {errors ? (
                    <Alert severity="error" onClose={() => updateErrors('')}>
                        {errors}
                    </Alert>
                ) : null}
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
                    {state.allowedVars.map((v) => (
                        <CTSMVarInput
                            key={v.name}
                            variable={v}
                            value={variables[v.name]}
                            onChange={(value) => handleVarChange(v.name, value)}
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
