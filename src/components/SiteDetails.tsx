import axios from 'axios';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import CaseCreate from './CaseCreate';

interface Props {
    site: SiteProps;
}

const SiteDetails = ({ site }: Props) => {
    const [cases, updatedCases] = React.useState<CaseWithTaskInfo[]>([]);
    const [editCase, updatedEditCase] = React.useState(false);

    React.useEffect(() => {
        axios.get(`${API_PATH}/sites/${site.name}/cases`).then(({ data }) => {
            updatedCases(data);
        });
    }, []);

    return (
        <>
            <Card sx={{ m: 1 }} elevation={0}>
                <CardContent>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="h6">{site.name}</Typography>
                    </Box>
                    {site.description && (
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body1">{site.description}</Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">Compset:</Typography>
                        <Typography variant="caption" paragraph>
                            {site.compset}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">Grid:</Typography>
                        <Typography variant="caption" paragraph>
                            {site.res}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}>
                        <Button component="a" href={site.url} variant="outlined">
                            Download Site Data
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={editCase}
                            onClick={() => updatedEditCase(true)}
                        >
                            Create Case
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            {editCase ? (
                <CaseCreate onClose={() => updatedEditCase(false)} />
            ) : (
                <Box sx={{ m: 1 }}>
                    <Typography variant="body1">Cases:</Typography>
                    <Table>
                        <TableHead>
                            <TableCell>Case ID</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Status</TableCell>
                        </TableHead>
                        <TableBody>
                            {cases.map((caseInfo) => (
                                <TableRow key={caseInfo.task_id}>
                                    <TableCell>{caseInfo.id}</TableCell>
                                    <TableCell>{caseInfo.date_created}</TableCell>
                                    <TableCell>{caseInfo.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </>
    );
};

export default SiteDetails;
