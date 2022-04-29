import { format as formatDate } from 'date-fns';
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DatePicker from '@mui/lab/DatePicker';

import { StateContext } from '../../store';

interface Props {
    variable: CaseVariableConfig;
    pftIndexCount?: number;
    value?: VariableValue;
    handleError: (hasError: boolean) => void;
    onChange: (value?: VariableValue) => void;
}

const VariableInput = ({ variable, pftIndexCount, value, handleError, onChange }: Props) => {
    const { state, dispatch } = React.useContext(StateContext);

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
    const helperText = (
        <>
            {description ? (
                <>
                    {description.summary}
                    {description.details ? (
                        <>
                            &nbsp;
                            <Link
                                href="#"
                                onClick={(e) => {
                                    dispatch({
                                        type: 'updatePopover',
                                        popover: {
                                            anchor: e.currentTarget,
                                            text: description.details,
                                            url: description.url
                                        }
                                    });
                                }}
                            >
                                (read more)
                            </Link>
                        </>
                    ) : null}
                </>
            ) : null}
            {errors.length ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }} component="span">
                    {errors.map((error) => (
                        <Typography key={error} variant="caption" component="span">
                            {error}
                        </Typography>
                    ))}
                </Box>
            ) : null}
        </>
    );

    const handleChange = (changedValue?: VariableValue) => {
        const variableErrors: string[] = [];

        if (changedValue) {
            const arrayValue = Array.isArray(changedValue) ? changedValue : [changedValue];

            const { name, validation, type } = variable;

            arrayValue.forEach((v) => {
                if (validation?.choices?.findIndex((c) => c === v) === -1) {
                    variableErrors.push(`${name} must be one of ${validation.choices.join(', ')}`);
                } else if (validation?.pattern && !new RegExp(validation.pattern).test(v.toString())) {
                    variableErrors.push(`${name} must match pattern ${validation.pattern}`);
                } else if (type === 'integer' || type === 'float') {
                    const numberValue = Number(v);
                    if (Number.isNaN(numberValue)) {
                        variableErrors.push(`${name} must be a number`);
                    } else {
                        const minValue = Number(validation?.min);
                        const maxValue = Number(validation?.max);
                        if (!Number.isNaN(minValue) && numberValue < minValue) {
                            variableErrors.push(`${name} must be greater than or equal to ${minValue}`);
                        }
                        if (maxValue && numberValue > maxValue) {
                            variableErrors.push(`${name} must be less than or equal to ${maxValue}`);
                        }
                    }
                }
            });
        }
        handleError(variableErrors.length > 0);
        updateErrors(variableErrors);
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

        updateErrors(variableErrors.some((e) => e) ? ['Only accepts number'] : []);

        if (!variableErrors.length) {
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
                <TableCell sx={{ borderBottom: 'none ' }} align="center" size="small">
                    {variable.name}
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
                    value={
                        value ||
                        (variable.allow_multiple && !Array.isArray(defaultValue)
                            ? Array(defaultValue === null ? 0 : 1).fill(defaultValue)
                            : defaultValue)
                    }
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
                                checked={!!(value === undefined ? defaultValue : value)}
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
