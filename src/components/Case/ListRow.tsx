import axios from 'axios';
import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';

const TaskStatusEl = ({ taskStatus, error }: { taskStatus: TaskStatus; error?: string }) => {
    const { dispatch } = React.useContext(StateContext);

    if (taskStatus === 'FAILURE') {
        return (
            <>
                <Typography component="span" variant="caption">
                    Failed
                </Typography>
                <IconButton
                    size="small"
                    onClick={(e) =>
                        dispatch({
                            type: 'updatePopover',
                            popover: {
                                anchor: e.currentTarget,
                                text: error
                            }
                        })
                    }
                >
                    <Icon baseClassName="icons" fontSize="small" color="error">
                        error_outline
                    </Icon>
                </IconButton>
            </>
        );
    }
    if (taskStatus === 'SUCCESS') {
        return (
            <>
                <Typography component="span" variant="caption">
                    Ready
                </Typography>
                <Icon baseClassName="icons" fontSize="small" color="success">
                    check_circle_outline
                </Icon>
            </>
        );
    }
    return (
        <>
            <Typography component="span" variant="caption">
                Running ({taskStatus})
            </Typography>
            <CircularProgress size={20} />
        </>
    );
};

interface Props {
    caseInfo: CaseWithTaskInfo;
    handleEdit: () => void;
    handleDelete: () => void;
}

const CaseListRow = ({ caseInfo, handleEdit, handleDelete }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);
    const [showVariables, updateShowVariables] = React.useState(false);
    const [isDownloading, updateIsDownloading] = React.useState(false);

    React.useEffect(() => {
        let intervalId: number;

        if (
            state.selectedSite &&
            (!['SUCCESS', 'FAILURE', 'REVOKED'].includes(caseInfo.create_task.status || '') ||
                (['BUILDING', 'BUILT'].includes(caseInfo.status) &&
                    !['SUCCESS', 'FAILURE', 'REVOKED'].includes(caseInfo.run_task.status || '')))
        ) {
            // These are the unready states
            const checkStatus = () => {
                axios.get<CaseWithTaskInfo>(`${API_PATH}/cases/${caseInfo.id}`).then(({ data }) => {
                    if (data.status !== caseInfo.status) {
                        // Update the case task info
                        dispatch({
                            type: 'updateSelectedSiteCases',
                            cases: state.selectedSiteCases?.map((c) => {
                                if (c.id === caseInfo.id) {
                                    return data;
                                }
                                return c;
                            })
                        });
                    }
                });
            };
            intervalId = setInterval(checkStatus, 10000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [
        caseInfo.status,
        caseInfo.create_task.status,
        caseInfo.run_task.status,
        state.selectedSite,
        state.selectedSiteCases
    ]);

    const downloadResults = () => {
        updateIsDownloading(true);
        axios
            .get<string>(`${API_PATH}/cases/${caseInfo.id}/download`, {
                responseType: 'blob'
            })
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                const filename =
                    (resp.headers['content-disposition']?.match(/filename="(.*)"/) || [])[1] || `${caseInfo.id}.tar.gz`;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                updateIsDownloading(false);
            });
    };

    return (
        <>
            <TableRow key={caseInfo.create_task_id}>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {caseInfo.id}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        Create:
                        <TaskStatusEl taskStatus={caseInfo.create_task.status} error={caseInfo.create_task.error} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        Run: <TaskStatusEl taskStatus={caseInfo.run_task.status} error={caseInfo.run_task.error} />
                    </Stack>
                </TableCell>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {new Date(caseInfo.date_created).toLocaleString()}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {caseInfo.res}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {caseInfo.compset}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Link component="button" onClick={() => updateShowVariables(true)}>
                        See Variables
                    </Link>
                </TableCell>
                <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                        <LoadingButton
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={caseInfo.create_task.status !== 'SUCCESS' && caseInfo.status !== 'SUBMITTED'}
                            loading={isDownloading}
                            onClick={downloadResults}
                        >
                            Download Results
                        </LoadingButton>
                        <Button variant="outlined" color="primary" size="small" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Stack>
                </TableCell>
            </TableRow>
            <Dialog open={showVariables} fullWidth maxWidth={false} onClose={() => updateShowVariables(false)}>
                <DialogTitle>Variables</DialogTitle>
                <DialogContent>
                    <List dense disablePadding>
                        {state.variablesConfig.map((variableConfig) => (
                            <ListItem key={variableConfig.name}>
                                <ListItemText
                                    sx={{ pl: 0, display: 'flex' }}
                                    primary={`${variableConfig.name}:`}
                                    primaryTypographyProps={{ sx: { mr: 1 }, variant: 'caption' }}
                                    secondary={(
                                        caseInfo.variables.find((v) => v.name === variableConfig.name)?.value ||
                                        variableConfig.default ||
                                        ''
                                    ).toLocaleString()}
                                    secondaryTypographyProps={{ component: 'span', variant: 'subtitle2' }}
                                    inset
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CaseListRow;
