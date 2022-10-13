import axios from 'axios';
import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import Variables from './Variables';

interface Props {
    caseInfo: CaseWithTaskInfo;
    handleClose: () => void;
}

const CaseDelete = ({ caseInfo, handleClose }: Props) => {
    const [, dispatch] = React.useContext(StoreContext);

    const [errors, updateErrors] = React.useState<string>('');

    const handleDelete = () => {
        axios
            .delete(`${API_PATH}/cases/${caseInfo.id}`)
            .then(() => {
                dispatch({
                    type: 'deleteCase',
                    case: caseInfo
                });
                handleClose();
            })
            .catch((err) => {
                updateErrors(err.response.data.message);
            });
    };

    return (
        <Dialog open fullWidth maxWidth={false} onClose={handleClose}>
            <DialogTitle>Delete the following case?</DialogTitle>
            <DialogContent dividers>
                {errors ? (
                    <Alert severity="error" onClose={() => updateErrors('')}>
                        {errors}
                    </Alert>
                ) : null}
                <Typography variant="body1">Case ID: {caseInfo.id}</Typography>
                <Typography variant="body1">
                    Date Created: {new Date(caseInfo.date_created).toLocaleString()}
                </Typography>
                <Typography variant="body1">Status: {caseInfo.status}</Typography>
                <Typography variant="body1">Compset: {caseInfo.compset}</Typography>
                <Typography variant="body1">Variables:</Typography>
                <Variables variables={caseInfo.variables} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CaseDelete;
