import axios from 'axios';
import React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

interface Props {
    site: SiteProps;
}

const SiteDetails = ({ site }: Props) => {
    const [cases, updatedCases] = React.useState<CaseWithTaskInfo[]>([]);

    React.useEffect(() => {
        axios.get(`${API_PATH}/sites/${site.name}/cases`).then(({ data }) => {
            updatedCases(data);
        });
    }, [site.name]);

    return (
        <>
            <Typography variant="h4">Cases:</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Case ID</TableCell>
                        <TableCell align="center">Date Created</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Grid</TableCell>
                        <TableCell align="center">Compset</TableCell>
                        <TableCell align="center">Variables</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cases.map((caseInfo) => (
                        <TableRow key={caseInfo.task_id}>
                            <TableCell>
                                <Typography component="span" variant="caption">
                                    {caseInfo.id}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography component="span" variant="caption">
                                    {new Date(caseInfo.date_created).toLocaleString()}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography component="span" variant="caption">
                                    {caseInfo.status}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography component="span" variant="caption">
                                    {caseInfo.res}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography component="span" variant="caption">
                                    {caseInfo.compset}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <List dense disablePadding>
                                    {Object.entries(caseInfo.variables).map(([variable, value]) => (
                                        <ListItem key={variable} disableGutters disablePadding>
                                            <ListItemText
                                                sx={{ pl: 0, display: 'flex' }}
                                                primary={`${variable}:`}
                                                primaryTypographyProps={{ sx: { mr: 1 }, variant: 'caption' }}
                                                secondary={value}
                                                secondaryTypographyProps={{ component: 'span', variant: 'subtitle2' }}
                                                inset
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="primary" size="small">
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default SiteDetails;
