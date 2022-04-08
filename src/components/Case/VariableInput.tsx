import { format as formatDate } from 'date-fns';
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';

interface Props {
    variable: CaseVariableConfig;
    value?: VariableValue;
    error?: string;
    onChange: (value?: VariableValue) => void;
}

const VariableInput = ({ variable, value, error, onChange }: Props) => {
    if (variable.readonly) {
        return (
            <FormControl size="small" margin="normal">
                <TextField
                    disabled
                    label={variable.name}
                    helperText={variable.description}
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        notched: true,
                        inputProps: {
                            placeholder: variable.default?.toString()
                        }
                    }}
                    value={variable.default}
                />
            </FormControl>
        );
    }
    if (variable.validation?.choices) {
        return (
            <FormControl size="small" margin="normal">
                <Autocomplete
                    multiple={variable.allow_multiple}
                    options={variable.validation.choices}
                    disableCloseOnSelect={variable.allow_multiple}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} error={!!error} size="small" margin="dense" label={variable.name} />
                    )}
                    value={
                        value ||
                        (variable.allow_multiple && !Array.isArray(variable.default)
                            ? [variable.default]
                            : variable.default)
                    }
                    onChange={(_event, newValue) => {
                        onChange((newValue || undefined) as VariableValue);
                    }}
                />
                <FormHelperText>{variable.description}</FormHelperText>
            </FormControl>
        );
    }
    switch (variable.type) {
        case 'char':
            return (
                <FormControl size="small" margin="normal">
                    <TextField
                        error={!!error}
                        label={variable.name}
                        helperText={variable.description}
                        size="small"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            notched: true,
                            inputProps: {
                                pattern: variable.validation?.pattern,
                                placeholder: variable.default?.toString()
                            }
                        }}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </FormControl>
            );
        case 'date':
            return (
                <FormControl size="small" margin="normal">
                    <DatePicker
                        label={variable.name}
                        inputFormat="yyyy-MM-dd"
                        mask="____-__-__"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={!!error}
                                variant="outlined"
                                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                InputProps={{
                                    ...params.InputProps,
                                    notched: true,
                                    inputProps: {
                                        ...params.inputProps,
                                        placeholder: variable.default?.toString()
                                    }
                                }}
                                helperText={variable.description}
                                size="small"
                                margin="dense"
                            />
                        )}
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        // @ts-ignore-next-line
                        value={value || variable.default}
                        onChange={(v: Date | null) => onChange(v ? formatDate(v, 'yyyy-MM-dd') : undefined)}
                    />
                </FormControl>
            );
        case 'integer':
        case 'float':
            return (
                <FormControl size="small" margin="normal">
                    <TextField
                        error={!!error}
                        label={variable.name}
                        helperText={variable.description}
                        size="small"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            notched: true,
                            inputProps: {
                                type: 'number',
                                min: variable.validation?.min,
                                max: variable.validation?.max,
                                placeholder: variable.default?.toString()
                            }
                        }}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </FormControl>
            );
        case 'logical':
            return (
                <FormControl size="small" margin="normal">
                    <FormControlLabel
                        label={variable.name}
                        control={
                            <Checkbox
                                checked={!!(value === undefined ? variable.default : value)}
                                onChange={(e) => onChange(e.target.checked)}
                            />
                        }
                    />
                    <FormHelperText>{variable.description}</FormHelperText>
                </FormControl>
            );
        default:
            throw new Error(`Unknown variable type: ${variable.type}`);
    }
};

export default VariableInput;
