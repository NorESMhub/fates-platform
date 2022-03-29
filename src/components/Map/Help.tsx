import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface Props {
    open: boolean;
    onClose: () => void;
}

const Help = ({ open, onClose }: Props) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>How to navigate the map</DialogTitle>
        <DialogContent>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Icon baseClassName="icons">explore</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Hold the ctrl button while panning the map with the mouse to change the map pitch and bearing. You can also use the right mouse button for this." />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon baseClassName="icons">zoom_in</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Activate the map by clicking on it and use +/- to zoom in or out." />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon baseClassName="icons">zoom_in_map</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Hold the shift button, click and drag the left mouse button to start drawing a rectangle on the map to zoom to." />
                </ListItem>
            </List>
        </DialogContent>
    </Dialog>
);

export default Help;
