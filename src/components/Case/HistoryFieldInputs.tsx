import React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import { valueExists } from '../../utils/cases';
import InputHelperText from './InputHelperText';
import VariableInput from './VariableInput';

interface Props {
    parentVariable: CaseVariableConfig;
    parentVariableValue: string[];
    variables: { [key: string]: VariableValue | undefined };
    handleVariableChange: (name: string, value?: VariableValue) => void;
    handleVariableErrors: (name: string, hasError: boolean) => void;
}

const HistoryFieldInputs = ({
    parentVariable,
    parentVariableValue,
    variables,
    handleVariableChange,
    handleVariableErrors
}: Props) => {
    const { state } = React.useContext(StateContext);

    const [errorMessages, updateErrorMessages] = React.useState<{ [variable: string]: string[] }>({});

    const historyFields = state.variablesConfig.filter(
        (variableConfig) => variableConfig.count_depends_on === parentVariable.name
    );

    const handleHistoryFieldValueChange = (
        variableName: string,
        valueIdx: number,
        value?: string | number | boolean
    ) => {
        const newValue = (variables[variableName] || Array(parentVariableValue.length).fill(undefined)) as Array<
            string | number | boolean | undefined
        >;
        newValue[valueIdx] = value;

        const existingValue = valueExists(value) ? value : newValue.find((v) => valueExists(v));

        if (valueExists(existingValue)) {
            handleVariableChange(
                variableName,
                newValue.map((v) => (valueExists(v) ? v : existingValue)) as VariableValue
            );
        } else {
            handleVariableChange(variableName, []);
        }
    };

    return (
        <Box>
            <Typography variant="h6">{parentVariable.label || parentVariable.name}</Typography>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" size="small" />
                        {parentVariableValue.map((historyField) => {
                            return (
                                <TableCell key={historyField.toString()} align="center" size="small">
                                    {historyField}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {historyFields.map((variableConfig) => (
                        <TableRow key={variableConfig.name}>
                            <TableCell sx={{ borderBottom: 'none ', maxWidth: 100 }} align="center" size="small">
                                {variableConfig.label || variableConfig.name}
                                <FormHelperText error={errorMessages[variableConfig.name]?.length > 0}>
                                    <InputHelperText
                                        description={variableConfig.description}
                                        errors={errorMessages[variableConfig.name] || []}
                                    />
                                </FormHelperText>
                            </TableCell>
                            {parentVariableValue.map((historyField, idx) => {
                                const values = (variables[variableConfig.name] || []) as Array<
                                    string | number | boolean | undefined
                                >;
                                return (
                                    <TableCell
                                        key={historyField.toString()}
                                        sx={{ borderBottom: 'none' }}
                                        align="center"
                                        size="small"
                                    >
                                        <VariableInput
                                            variable={{ ...variableConfig, allow_multiple: false }}
                                            value={values[idx]}
                                            hideHelperText
                                            onErrors={(historyFieldErrors: string[]) => {
                                                updateErrorMessages({
                                                    ...errorMessages,
                                                    [variableConfig.name]: historyFieldErrors
                                                });
                                                handleVariableErrors(
                                                    variableConfig.name,
                                                    historyFieldErrors.length > 0
                                                );
                                            }}
                                            onChange={(value) => {
                                                handleHistoryFieldValueChange(
                                                    variableConfig.name,
                                                    idx,
                                                    value as string | number | boolean | undefined
                                                );
                                            }}
                                        />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default HistoryFieldInputs;
