import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { StoreContext } from '../../store';
import { renderVariableValue } from '../../utils/cases';

interface Props {
    variables: CaseVariable[];
}

const Variables = ({ variables }: Props) => {
    const [state] = React.useContext(StoreContext);

    const nlCLMExtra = variables.find((v) => v.name === 'user_nl_clm_extra');

    return (
        <List dense disablePadding>
            {state.variablesConfig.map((variableConfig) => (
                <ListItem key={variableConfig.name}>
                    <ListItemText
                        sx={{ pl: 0, display: 'flex' }}
                        primary={`${variableConfig.label || variableConfig.name}:`}
                        primaryTypographyProps={{ sx: { mr: 1 }, variant: 'caption' }}
                        secondary={renderVariableValue(variables, variableConfig)}
                        secondaryTypographyProps={{ component: 'span', variant: 'subtitle2' }}
                        inset
                    />
                </ListItem>
            ))}
            {nlCLMExtra && (
                <ListItem>
                    <ListItemText
                        sx={{ pl: 0, display: 'flex' }}
                        primary="CLM namelist extra:"
                        primaryTypographyProps={{ sx: { mr: 1 }, variant: 'caption' }}
                        secondary={nlCLMExtra.value}
                        secondaryTypographyProps={{ component: 'span', variant: 'subtitle2' }}
                        inset
                    />
                </ListItem>
            )}
        </List>
    );
};

export default Variables;
