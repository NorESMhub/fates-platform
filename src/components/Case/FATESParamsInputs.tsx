import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import VariableInput from './VariableInput';

interface Props {
    pftIndexCount: number;
    variables: { [key: string]: VariableValue | undefined };
    handleVariableChange: (name: string, value?: VariableValue) => void;
    handleVariableErrors: (name: string, hasError: boolean) => void;
}

const FATESParamsInputs = ({ pftIndexCount, variables, handleVariableChange, handleVariableErrors }: Props) => {
    const { state } = React.useContext(StateContext);

    return (
        <Box>
            <Typography variant="h6">FATES Parameters</Typography>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" size="small">
                            Indices
                        </TableCell>
                        {[...Array(pftIndexCount).keys()].map((idx) => {
                            const idxStr = (idx + 1).toString(10);
                            return (
                                <TableCell key={idx} align="center" size="small">
                                    <Checkbox
                                        checked={(variables.included_pft_indices as string[]).includes(idxStr)}
                                        onChange={(e) => {
                                            const newValue = new Set(variables.included_pft_indices as string[]);
                                            if (e.target.checked) {
                                                newValue.add(idxStr);
                                            } else {
                                                newValue.delete(idxStr);
                                            }
                                            handleVariableChange('included_pft_indices', Array.from(newValue));
                                        }}
                                    />
                                    {idx + 1}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.variablesConfig
                        .filter((variableConfig) => variableConfig.category === 'fates_param' && !variableConfig.hidden)
                        .map((variableConfig) => (
                            <TableRow key={variableConfig.name}>
                                <VariableInput
                                    variable={variableConfig}
                                    pftIndexCount={pftIndexCount}
                                    value={variables[variableConfig.name]}
                                    onErrors={(errors) => handleVariableErrors(variableConfig.name, errors.length > 0)}
                                    onChange={(value) => handleVariableChange(variableConfig.name, value)}
                                />
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default FATESParamsInputs;
