import React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { ConfigContext } from '../../store';
import { valueExists } from '../../utils/cases';
import InfoPopover from '../InfoPopover';
import InputHelperText from './InputHelperText';
import VariableInput from './VariableInput';

interface Props {
    variables: { [key: string]: VariableValue | undefined };
    handleVariableChange: (name: string, value?: VariableValue) => void;
    handleVariableErrors: (name: string, hasError: boolean) => void;
}

const HistoryInputs = ({ variables, handleVariableChange, handleVariableErrors }: Props) => {
    const { variablesConfig } = React.useContext(ConfigContext);

    const [infoPopover, updatedInfoPopover] = React.useState<{
        anchor: HTMLElement;
        text: string;
        url?: string;
    } | null>(null);

    const [errorMessages, updateErrorMessages] = React.useState<{ [variable: string]: string[] }>({});

    const historyFiles: CaseVariableConfig[] = [];
    const historyVariables: CaseVariableConfig[] = [];
    variablesConfig.forEach((config) => {
        if (config.name.startsWith('hist_fincl')) {
            historyFiles.push(config);
        } else if (config.category === 'user_nl_clm_history_file') {
            historyVariables.push(config);
        }
    });

    const handleHistoryVariableChange = (
        variableConfig: CaseVariableConfig,
        valueIdx: number,
        value?: string | number | boolean
    ) => {
        // Expects a default value to exist.
        // This value must be an array with the same length as the number of history streams.
        const newValue = [
            ...((variables[variableConfig.name] || variableConfig.default) as Array<
                string | number | boolean | undefined
            >)
        ];
        newValue[valueIdx] = valueExists(value)
            ? value
            : (variableConfig.default as Array<string | number | boolean | undefined>)[valueIdx];
        handleVariableChange(variableConfig.name, newValue as VariableValue);
    };

    return (
        <Box>
            <Typography variant="h6">History Files</Typography>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" size="small" />
                        {historyFiles.map(({ name, label }) => (
                            <TableCell key={name} align="center" size="small">
                                {label || name}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }} align="center" size="small">
                            Outputs
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    updatedInfoPopover({
                                        anchor: e.currentTarget,
                                        text: 'Fields to add to history tape series n.<br>You can add any variable from the list in the link, if it is not already in the options.<br>Just type tha variable name and press enter.<br>Note that the entered variable name must exactly match the name in the list.',
                                        url: 'https://escomp.github.io/ctsm-docs/versions/master/html/users_guide/setting-up-and-running-a-case/master_list_fates.html'
                                    });
                                }}
                            >
                                <Icon baseClassName="icons" fontSize="small">
                                    info
                                </Icon>
                            </IconButton>
                        </TableCell>
                        {historyFiles.map((variableConfig) => (
                            <TableCell
                                key={variableConfig.name}
                                sx={{ borderBottom: 'none' }}
                                align="center"
                                size="small"
                            >
                                <VariableInput
                                    variable={variableConfig}
                                    value={variables[variableConfig.name]}
                                    hideHelperText
                                    onErrors={(errors: string[]) => {
                                        updateErrorMessages({
                                            ...errorMessages,
                                            [variableConfig.name]: errors
                                        });
                                        handleVariableErrors(variableConfig.name, errors.length > 0);
                                    }}
                                    onChange={(value) => {
                                        handleVariableChange(variableConfig.name, value);
                                    }}
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                    {historyVariables.map((variableConfig) => (
                        <TableRow key={variableConfig.name}>
                            <TableCell sx={{ borderBottom: 'none' }} align="center" size="small">
                                {variableConfig.label || variableConfig.name}
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        variableConfig.description?.summary &&
                                            updatedInfoPopover({
                                                anchor: e.currentTarget,
                                                text: [
                                                    variableConfig.description?.summary,
                                                    variableConfig.description?.details
                                                ].join('<br>'),
                                                url: variableConfig.description?.url
                                            });
                                    }}
                                >
                                    <Icon baseClassName="icons" fontSize="small">
                                        info
                                    </Icon>
                                </IconButton>
                                <FormHelperText error={errorMessages[variableConfig.name]?.length > 0}>
                                    <InputHelperText errors={errorMessages[variableConfig.name] || []} />
                                </FormHelperText>
                            </TableCell>
                            {historyFiles.map((historyField, idx) => (
                                <TableCell
                                    key={historyField.name}
                                    sx={{ borderBottom: 'none' }}
                                    align="center"
                                    size="small"
                                >
                                    <VariableInput
                                        variable={{
                                            ...variableConfig,
                                            allow_multiple: false,
                                            placeholder: ((variableConfig.default || []) as number[])[idx].toString(),
                                            default: ((variableConfig.default || []) as number[])[idx]
                                        }}
                                        value={
                                            (
                                                (variables[variableConfig.name] || []) as Array<
                                                    string | number | boolean | undefined
                                                >
                                            )[idx]
                                        }
                                        hideLabel
                                        hideHelperText
                                        onErrors={(errors: string[]) => {
                                            updateErrorMessages({
                                                ...errorMessages,
                                                [variableConfig.name]: errors
                                            });
                                            handleVariableErrors(variableConfig.name, errors.length > 0);
                                        }}
                                        onChange={(value) => {
                                            handleHistoryVariableChange(
                                                variableConfig,
                                                idx,
                                                value as string | number | boolean | undefined
                                            );
                                        }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {infoPopover ? (
                <InfoPopover
                    anchor={infoPopover.anchor}
                    text={infoPopover.text}
                    url={infoPopover.url}
                    handleClose={() => updatedInfoPopover(null)}
                />
            ) : null}
        </Box>
    );
};

export default HistoryInputs;
