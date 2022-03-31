import axios from 'axios';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { StateContext } from '../store';

interface Props {
    onClose: () => void;
}

const CaseCreate = ({ onClose }: Props) => {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-evenly' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
            {state.allowedVars.map((v) => (
                <TextField key={v} label={v} />
            ))}
        </Box>
    );
};

export default CaseCreate;
