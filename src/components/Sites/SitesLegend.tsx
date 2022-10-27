import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const SitesLegend = () => (
    <List dense disablePadding>
        <ListItem dense>
            <svg width={20} height={20}>
                <circle cx={10} cy={10} r={5} fill="#39B54A" />
            </svg>
            Predefined Sites
        </ListItem>
        <ListItem dense>
            <svg width={20} height={20}>
                <circle cx={10} cy={10} r={5} fill="#8C1ACE" />
            </svg>
            Custom Sites
        </ListItem>
    </List>
);

export default SitesLegend;
