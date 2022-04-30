import { format as formatDate } from 'date-fns';
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';

import { StateContext } from '../../store';
import { valueExists } from '../../utils/values';
import InputHelperText from './InputHelperText';

interface Props {
    variable: CaseVariableConfig;
    pftIndexCount?: number;
    value?: VariableValue;
    hideHelperText?: boolean;
    onErrors: (errors: string[]) => void;
    onChange: (value?: VariableValue) => void;
}

const VariableInput = ({ variable, pftIndexCount, value, hideHelperText, onErrors, onChange }: Props) => {
    const { state } = React.useContext(StateContext);

    const [errors, updateErrors] = React.useState<string[]>([]);
    const hasErrors = errors.length > 0;

    const [fatesErrors, updateFATESErrors] = React.useState<boolean[]>([]);

    const [fatesParamValue, updateFATESParamValue] = React.useState<(VariableValue | undefined)[]>(
        value as VariableValue[]
    );

    const defaultValue = state.selectedSite?.config?.find((v) => v.name === variable.name)?.value || variable.default;
    const getFATESParamValue = (): (VariableValue | undefined)[] => {
        return (fatesParamValue || defaultValue) as (VariableValue | undefined)[];
    };

    const label = variable.label || variable.name;

    const { description } = variable;
    const helperText = hideHelperText ? null : <InputHelperText description={description} errors={errors} />;

    const handleChange = (changedValue?: VariableValue) => {
        const variableErrors: string[] = [];

        if (changedValue) {
            const arrayValue = Array.isArray(changedValue) ? changedValue : [changedValue];

            const { validation, type } = variable;

            arrayValue.forEach((v) => {
                if (validation?.choices?.findIndex((c) => c === v) === -1) {
                    variableErrors.push(`${label} must be one of ${validation.choices.join(', ')}`);
                } else if (validation?.pattern && !new RegExp(validation.pattern).test(v.toString())) {
                    variableErrors.push(`${label} must match pattern ${validation.pattern}`);
                } else if (type === 'integer' || type === 'float') {
                    const numberValue = Number(v);
                    if (Number.isNaN(numberValue)) {
                        variableErrors.push(`${label} must be a number`);
                    } else {
                        const minValue = Number(validation?.min);
                        const maxValue = Number(validation?.max);
                        if (!Number.isNaN(minValue) && numberValue < minValue) {
                            variableErrors.push(`${label} must be greater than or equal to ${minValue}`);
                        }
                        if (maxValue && numberValue > maxValue) {
                            variableErrors.push(`${label} must be less than or equal to ${maxValue}`);
                        }
                    }
                }
            });
        }
        updateErrors(variableErrors);
        onErrors(variableErrors);
        onChange(changedValue);
    };

    const handleFATESParamChange = (idx: number, changedValue?: string) => {
        const variableErrors = [...fatesErrors];
        variableErrors[idx] = false;

        if (changedValue) {
            if (Number.isNaN(Number(changedValue))) {
                variableErrors[idx] = true;
            }
        }

        const newValue = [...getFATESParamValue()];
        newValue[idx] = changedValue;

        updateFATESErrors(variableErrors);
        updateFATESParamValue(newValue);

        const hasFATESErrors = variableErrors.some((e) => e);
        updateErrors(hasFATESErrors ? ['Only accepts number'] : []);
        onErrors(hasFATESErrors ? ['Only accepts number'] : []);

        if (!hasFATESErrors) {
            handleChange(newValue as VariableValue);
        }
    };

    if (variable.readonly) {
        return (
            <FormControl size="small" margin="normal">
                <TextField
                    disabled
                    label={label}
                    helperText={helperText}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        notched: true,
                        inputProps: {
                            placeholder: defaultValue?.toString()
                        }
                    }}
                    value={defaultValue}
                />
            </FormControl>
        );
    }

    if (variable.category === 'fates_param') {
        return (
            <>
                <TableCell sx={{ borderBottom: 'none', maxWidth: 100 }} align="center" size="small">
                    {label}
                    <FormHelperText error={hasErrors}>{helperText}</FormHelperText>
                </TableCell>
                {[...Array(pftIndexCount).keys()].map((idx) => (
                    <TableCell key={idx} sx={{ borderBottom: 'none ' }} align="center" size="small">
                        <TextField
                            error={fatesErrors[idx]}
                            size="small"
                            margin="dense"
                            variant="standard"
                            InputProps={{
                                inputProps: {
                                    sx: { textAlign: 'center' },
                                    placeholder: (defaultValue as VariableValue[])[idx].toString()
                                }
                            }}
                            value={getFATESParamValue()[idx]}
                            onChange={(e) => handleFATESParamChange(idx, e.target.value)}
                        />
                    </TableCell>
                ))}
            </>
        );
    }

    if (variable.validation?.choices) {
        let selectValue;
        if (variable.allow_multiple) {
            if (value) {
                if (Array.isArray(value)) {
                    selectValue = value.map((v) => {
                        if (typeof v === 'string' && v.startsWith("'") && v.endsWith("'")) {
                            return v.slice(1, -1);
                        }
                        return v;
                    });
                } else if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
                    selectValue = [value.slice(1, -1)];
                } else {
                    selectValue = [value];
                }
            } else {
                selectValue = defaultValue || [];
            }
        } else if (value) {
            if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
                selectValue = value.slice(1, -1);
            } else {
                selectValue = value;
            }
        } else {
            selectValue = defaultValue;
        }

        return (
            <FormControl size="small" margin="normal">
                <Autocomplete
                    multiple={variable.allow_multiple}
                    options={variable.validation.choices}
                    getOptionLabel={(option) => option?.toString() || ''}
                    disableCloseOnSelect={variable.allow_multiple}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} error={hasErrors} size="small" margin="dense" label={label} />
                    )}
                    value={selectValue}
                    onChange={(_event, newValue) => {
                        onChange((newValue || undefined) as VariableValue);
                    }}
                />
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }

    switch (variable.type) {
        case 'char':
        case 'integer':
        case 'float':
            return (
                <FormControl size="small" margin="normal">
                    <TextField
                        error={hasErrors}
                        label={label}
                        helperText={helperText}
                        size="small"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            notched: true,
                            inputProps: {
                                placeholder: defaultValue?.toString()
                            }
                        }}
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </FormControl>
            );
        case 'date':
            return (
                <FormControl size="small" margin="normal">
                    <DatePicker
                        label={label}
                        inputFormat="yyyy-MM-dd"
                        mask="____-__-__"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={hasErrors}
                                variant="outlined"
                                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                InputProps={{
                                    ...params.InputProps,
                                    notched: true,
                                    inputProps: {
                                        ...params.inputProps,
                                        placeholder: defaultValue?.toString()
                                    }
                                }}
                                helperText={helperText}
                                size="small"
                                margin="dense"
                            />
                        )}
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        // @ts-ignore-next-line
                        value={value || defaultValue}
                        onChange={(v: Date | null) => onChange(v ? formatDate(v, 'yyyy-MM-dd') : undefined)}
                    />
                </FormControl>
            );
        case 'logical':
            return (
                <FormControl size="small" margin="normal">
                    <FormControlLabel
                        label={label}
                        control={
                            <Checkbox
                                checked={!!(valueExists(value) ? value : defaultValue)}
                                onChange={(e) => onChange(e.target.checked)}
                            />
                        }
                    />
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
            );
        default:
            throw new Error(`Unknown variable type: ${variable.type}`);
    }
};

export default VariableInput;
