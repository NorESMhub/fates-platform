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
    variable: CTSMAllowedVars;
    value?: CTSMVarValue;
    onChange: (value?: CTSMVarValue) => void;
}

const CTSMVarInput = ({ variable, value, onChange }: Props) => {
    if (variable.choices) {
        return (
            <FormControl size="small" margin="normal">
                <Autocomplete
                    multiple={variable.allow_multiple}
                    options={variable.choices}
                    disableCloseOnSelect
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} size="small" margin="dense" label={variable.name} />
                    )}
                    value={
                        value ||
                        (variable.allow_multiple && !Array.isArray(variable.default)
                            ? [variable.default]
                            : variable.default)
                    }
                    onChange={(_event, newValue) => {
                        onChange((newValue || undefined) as CTSMVarValue);
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
                        label={variable.name}
                        helperText={variable.description}
                        size="small"
                        margin="dense"
                        value={value || variable.default}
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
                            <TextField {...params} helperText={variable.description} size="small" margin="dense" />
                        )}
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        // @ts-ignore-next-line
                        value={value || variable.default}
                        onChange={(v: Date | null) => onChange(v ? formatDate(v, 'yyyy-MM-dd') : undefined)}
                    />
                </FormControl>
            );
        case 'integer':
            return (
                <FormControl size="small" margin="normal">
                    <TextField
                        label={variable.name}
                        helperText={variable.description}
                        size="small"
                        margin="dense"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        value={value || variable.default}
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

export default CTSMVarInput;
