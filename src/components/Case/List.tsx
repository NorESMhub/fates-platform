import axios from 'axios';
import React from 'react';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import CaseDelete from './Delete';
import CaseEdit from './Edit';
import CaseListRow from './ListRow';

interface Props {
    site: SiteProps;
}

const SiteList = ({ site }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

    const [columnInfoProps, updateColumnInfoProps] = React.useState<{
        anchor?: HTMLElement;
        text?: string;
        url?: string;
    }>({});

    const [editCase, updatedEditCase] = React.useState<CaseWithTaskInfo | null>(null);
    const [deleteCase, updatedDeleteCase] = React.useState<CaseWithTaskInfo | null>(null);

    React.useEffect(() => {
        axios.get<CaseWithTaskInfo[]>(`${API_PATH}/sites/${site.name}/cases`).then(({ data }) => {
            dispatch({
                type: 'updateSelectedSiteCases',
                cases: data
            });
        });
    }, [site.name]);

    return (
        <>
            <Typography variant="h4">Cases:</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        {[
                            { label: 'Case ID' },
                            { label: 'Status' },
                            { label: 'Date Created' },
                            { label: 'Grid', description: { text: '[PLACEHOLDER_TEXT]' } },
                            { label: 'Compset', description: { text: '[PLACEHOLDER_TEXT]' } },
                            { label: 'Variables', description: { text: '[PLACEHOLDER_TEXT]' } }
                        ].map(({ label, description }) => (
                            <TableCell key={label} align="center">
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="h6">{label}</Typography>
                                    {description ? (
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                updateColumnInfoProps({
                                                    anchor: e.currentTarget,
                                                    text: description.text,
                                                    url: description.url
                                                })
                                            }
                                        >
                                            <Icon baseClassName="icons" fontSize="inherit">
                                                info_outline
                                            </Icon>
                                        </IconButton>
                                    ) : null}
                                </Stack>
                            </TableCell>
                        ))}
                        <TableCell align="center" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.selectedSiteCases?.map((caseInfo) => (
                        <CaseListRow
                            key={caseInfo.task_id}
                            caseInfo={caseInfo}
                            handleEdit={() => updatedEditCase(caseInfo)}
                            handleDelete={() => updatedDeleteCase(caseInfo)}
                        />
                    ))}
                </TableBody>
            </Table>
            <Popover
                open={Boolean(columnInfoProps.anchor)}
                disableRestoreFocus
                anchorEl={columnInfoProps.anchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                onClose={() => updateColumnInfoProps({})}
            >
                <Stack sx={{ p: 1, maxWidth: 300 }} direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption">{columnInfoProps.text}</Typography>
                    {columnInfoProps.url ? (
                        <Link href={columnInfoProps.url} target="_blank" rel="noopener,noreferrer">
                            <Icon baseClassName="icons" fontSize="small">
                                launch
                            </Icon>
                        </Link>
                    ) : null}
                </Stack>
            </Popover>
            {editCase ? (
                <CaseEdit initialVariables={editCase.variables || {}} handleClose={() => updatedEditCase(null)} />
            ) : null}
            {deleteCase ? <CaseDelete caseInfo={deleteCase} handleClose={() => updatedDeleteCase(null)} /> : null}
        </>
    );
};

export default SiteList;
