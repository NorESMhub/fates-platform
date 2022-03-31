import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import { StateContext } from '../store';

const Sites = () => {
    const { state, dispatch } = React.useContext<StoreContext>(StateContext);

    const handleSiteClick = (site: SiteProps) => {
        dispatch({ type: 'updateSelectedSite', site });
    };

    return (
        <List subheader={<ListSubheader>Sites</ListSubheader>}>
            {state.sites &&
                state.sites.features.map(({ properties }) => (
                    <ListItem key={properties.name} dense>
                        <ListItemButton
                            component="a"
                            disableGutters
                            selected={state.selectedSite?.name === properties.name}
                            onClick={() => handleSiteClick(properties)}
                        >
                            <ListItemText
                                secondary={properties.name}
                                secondaryTypographyProps={{ variant: 'body2' }}
                                inset
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
        </List>
    );
};

export default Sites;
