import axios from 'axios';
import React from 'react';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
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
                        {(
                            [
                                { label: 'Case ID' },
                                { label: 'Status' },
                                { label: 'Date Created' },
                                { label: 'Grid', description: { text: '[PLACEHOLDER_TEXT]' } },
                                { label: 'Compset', description: { text: '[PLACEHOLDER_TEXT]' } },
                                { label: 'Variables', description: { text: '[PLACEHOLDER_TEXT]' } }
                            ] as Array<{ label: string; description: { text: string; url?: string } }>
                        ).map(({ label, description }) => (
                            <TableCell key={label} align="center">
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="h6">{label}</Typography>
                                    {description ? (
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                dispatch({
                                                    type: 'updatePopover',
                                                    popover: {
                                                        anchor: e.currentTarget,
                                                        text: description.text,
                                                        url: description.url
                                                    }
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
            {editCase ? (
                <CaseEdit
                    initialVariables={
                        editCase.variables.reduce<{ [key: string]: VariableValue | undefined }>(
                            (variables, variable) => {
                                variables[variable.name] = variable.value;
                                return variables;
                            },
                            {}
                        ) || {}
                    }
                    handleClose={() => updatedEditCase(null)}
                />
            ) : null}
            {deleteCase ? <CaseDelete caseInfo={deleteCase} handleClose={() => updatedDeleteCase(null)} /> : null}
        </>
    );
};

export default SiteList;
