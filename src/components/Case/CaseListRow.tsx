import axios from 'axios';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import { isCaseRunning } from '../../utils/cases';
import Status from './Status';
import Variables from './Variables';

interface Props {
    caseInfo: CaseWithTaskInfo;
    isBlocked: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
}

const CaseListRow = ({ caseInfo, isBlocked, handleEdit, handleDelete }: Props) => {
    const [state, dispatch] = React.useContext(StoreContext);

    const [showVariables, updateShowVariables] = React.useState(false);
    const [isDownloading, updateIsDownloading] = React.useState(false);

    React.useEffect(() => {
        let intervalId: number;

        if (!isBlocked && isCaseRunning(caseInfo)) {
            const checkStatus = () => {
                axios.get<CaseWithTaskInfo>(`${API_PATH}/cases/${caseInfo.id}`).then(({ data }) => {
                    if (
                        data.status !== caseInfo.status ||
                        data.create_task.status !== caseInfo.create_task.status ||
                        data.run_task.status !== caseInfo.run_task.status
                    ) {
                        // Update the case task info
                        dispatch({
                            type: 'updateCase',
                            case: data
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
    }, [caseInfo.status, caseInfo.create_task.status, caseInfo.run_task.status, state.selectedSite, isBlocked]);

    const handleRun = () => {
        axios
            .post<CaseWithTaskInfo>(`${API_PATH}/cases/${caseInfo.id}/`)
            .then(({ data }) => {
                dispatch({
                    type: 'updateCase',
                    case: data
                });
            })
            .catch(console.error);
    };

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
                    (resp.headers['content-disposition']?.match(/filename="(.*)"/) || [])[1] || `${caseInfo.id}.zip`;
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
                    <Typography component="span" variant="caption">
                        {caseInfo.name || '-'}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {caseInfo.site || '-'}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography component="span" variant="caption">
                            Create:
                        </Typography>
                        <Status status={caseInfo.create_task.status} error={caseInfo.create_task.error} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography component="span" variant="caption">
                            Run:
                        </Typography>
                        <Status status={caseInfo.run_task.status} error={caseInfo.run_task.error} />
                    </Stack>
                </TableCell>
                <TableCell align="center">
                    <Typography component="span" variant="caption">
                        {new Date(caseInfo.date_created).toLocaleString()}
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
                            disabled={!['CONFIGURED', 'SUBMITTED'].includes(caseInfo.status)}
                            onClick={handleRun}
                        >
                            Run
                        </LoadingButton>
                        <LoadingButton
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={caseInfo.run_task.status !== 'SUCCESS' && caseInfo.status !== 'SUBMITTED'}
                            loading={isDownloading}
                            onClick={downloadResults}
                        >
                            Download Results
                        </LoadingButton>
                        <Button variant="outlined" color="primary" size="small" onClick={handleEdit}>
                            Copy
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
                    <Variables variables={caseInfo.variables} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CaseListRow;
