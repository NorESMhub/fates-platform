import axios from 'axios';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { StateContext } from '../store';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CaseCreate = ({ open, onClose }: Props) => {
    const { state } = React.useContext(StateContext);

    const handleSubmit = () => {
        axios
            .post(`${API_PATH}/sites`, {
                site_name: state.selectedSite?.name,
                driver: 'mct'
            })
            .then(() => {
                onClose();
            })
            .catch(console.error);
    };

    return (
        <Dialog open={open} fullWidth onClose={onClose}>
            <DialogTitle>Create Case</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
                    {state.allowedVars.map((v) => (
                        <TextField key={v} label={v} size="small" variant="standard" margin="dense" />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CaseCreate;
