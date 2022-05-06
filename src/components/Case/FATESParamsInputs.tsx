import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ConfigContext, SelectionContext } from '../../store';
import { valueExists } from '../../utils/cases';
import InputHelperText from './InputHelperText';

interface Props {
    pftIndexCount: number;
    variables: { [key: string]: VariableValue | undefined };
    handleVariableChange: (name: string, value?: VariableValue) => void;
    handleVariableErrors: (name: string, hasError: boolean) => void;
}

const FATESParamsInputs = ({ pftIndexCount, variables, handleVariableChange, handleVariableErrors }: Props) => {
    const { variablesConfig } = React.useContext(ConfigContext);
    const { selectedSite } = React.useContext(SelectionContext);

    const [variablesErrors, updateVariablesErrors] = React.useState<{ [variable: string]: string[] }>({});
    const [variablesIndexErrors, updateVariablesIndexErrors] = React.useState<{ [variable: string]: boolean[] }>({});

    const [values, updateValues] = React.useState<{
        [variable: string]: (VariableValue | undefined)[];
    }>({});

    const handleParamChange = (variableConfig: CaseVariableConfig, idx: number, changedValue?: string) => {
        const variableIndexErrors = [...(variablesIndexErrors[variableConfig.name] || [])];
        variableIndexErrors[idx] = false;

        if (changedValue) {
            if (Number.isNaN(Number(changedValue))) {
                variableIndexErrors[idx] = true;
            }
        }

        const newValue = [...(values[variableConfig.name] || Array(pftIndexCount).fill(undefined))];
        newValue[idx] = changedValue;

        updateVariablesIndexErrors({
            ...variablesIndexErrors,
            [variableConfig.name]: variableIndexErrors
        });
        updateValues({
            ...values,
            [variableConfig.name]: newValue
        });

        const hasErrors = variableIndexErrors.some((e) => e);
        updateVariablesErrors({
            ...variablesErrors,
            [variableConfig.name]: hasErrors ? ['Only accepts number'] : []
        });
        handleVariableErrors(variableConfig.name, hasErrors);

        if (!hasErrors) {
            handleVariableChange(variableConfig.name, newValue as VariableValue);
        }
    };

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
                    {variablesConfig
                        .filter(({ category, hidden }) => category === 'fates_param' && !hidden)
                        .map((variableConfig) => {
                            const variableErrors = variablesErrors[variableConfig.name] || [];
                            const hasErrors = variableErrors.length > 0;

                            const defaultValue = (selectedSite?.config?.find((v) => v.name === variableConfig.name)
                                ?.value ||
                                variableConfig.default ||
                                []) as (VariableValue | undefined)[];
                            const value = values[variableConfig.name] || [];

                            return (
                                <TableRow key={variableConfig.name}>
                                    <TableCell sx={{ borderBottom: 'none' }} align="center" size="small">
                                        {variableConfig.label || variableConfig.name}
                                        <FormHelperText error={hasErrors}>
                                            <InputHelperText
                                                description={variableConfig.description}
                                                errors={variableErrors}
                                            />
                                        </FormHelperText>
                                    </TableCell>
                                    {[...Array(pftIndexCount).keys()].map((idx) => (
                                        <TableCell key={idx} sx={{ borderBottom: 'none' }} align="center" size="small">
                                            <TextField
                                                error={(variablesIndexErrors[variableConfig.name] || [])[idx]}
                                                size="small"
                                                margin="dense"
                                                variant="standard"
                                                InputProps={{
                                                    inputProps: {
                                                        sx: { textAlign: 'center' },
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        placeholder: (valueExists(defaultValue[idx])
                                                            ? defaultValue[idx]
                                                            : ''
                                                        ).toString()
                                                    }
                                                }}
                                                value={value[idx] || ''}
                                                onChange={(e) => handleParamChange(variableConfig, idx, e.target.value)}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </Box>
    );
};

export default FATESParamsInputs;
