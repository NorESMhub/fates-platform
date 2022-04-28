import axios from 'axios';
import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import { renderVariableValue } from '../../utils/cases';

interface Props {
    caseInfo: CaseWithTaskInfo;
    handleClose: () => void;
}

const CaseDelete = ({ caseInfo, handleClose }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

    const [errors, updateErrors] = React.useState<string>('');

    const handleDelete = () => {
        axios
            .delete(`${API_PATH}/cases/${caseInfo.id}`)
            .then(() => {
                dispatch({
                    type: 'updateSelectedSiteCases',
                    cases: state.selectedSiteCases?.filter((c) => c.id !== caseInfo.id)
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
                <Typography variant="body1">Grid: {caseInfo.res}</Typography>
                <Typography variant="body1">Compset: {caseInfo.compset}</Typography>
                <Typography variant="body1">Variables:</Typography>
                <List dense disablePadding>
                    {state.variablesConfig.map((variableConfig) => (
                        <ListItem key={variableConfig.name} disableGutters disablePadding>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={`${variableConfig.label || variableConfig.name}:`}
                                primaryTypographyProps={{ sx: { mr: 1 }, variant: 'caption' }}
                                secondary={renderVariableValue(caseInfo.variables, variableConfig)}
                                secondaryTypographyProps={{ component: 'span', variant: 'subtitle2' }}
                                inset
                            />
                        </ListItem>
                    ))}
                </List>
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
