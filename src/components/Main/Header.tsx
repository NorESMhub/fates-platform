import React from 'react';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import { HEADER_HEIGHT } from '../../theme';

const Header = () => {
    const [state] = React.useContext(StoreContext);

    const [showInfo, updateShowInfo] = React.useState(false);

    return (
        <>
            <AppBar
                sx={{
                    'height': HEADER_HEIGHT,
                    'color': 'primary.contrastText',
                    'backgroundColor': 'primary.light',
                    'justifyContent': 'center',
                    '& a': {
                        textDecoration: 'none',
                        color: 'primary.contrastText'
                    }
                }}
                position="relative"
                elevation={0}
                color="transparent"
            >
                <Toolbar>
                    <Typography sx={{ marginRight: 2, flexGrow: 1 }} variant="h4">
                        NorESM Land Sites Platform
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            updateShowInfo(true);
                        }}
                    >
                        <Icon baseClassName="icons">info</Icon>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Dialog
                open={showInfo}
                onClose={() => {
                    updateShowInfo(false);
                }}
            >
                <DialogTitle>About</DialogTitle>
                <DialogContent>
                    <Typography>
                        Welcome to the &nbsp;
                        <Link href="https://noresmhub.github.io/noresm-land-sites-platform/" target="_blank">
                            NorESM land sites platform
                        </Link>
                        .
                        <br />
                        Please see the&nbsp;
                        <Link href="https://noresmhub.github.io/noresm-land-sites-platform/user_guide/" target="_blank">
                            user guide
                        </Link>
                        &nbsp;for a guided tour of its contents and use.
                    </Typography>
                    <Divider sx={{ m: 2 }} />
                    <Typography variant="subtitle2">Model Info:</Typography>
                    <List>
                        <ListItem>
                            Repo:&nbsp;
                            <Link href={state.modelInfo?.model} target="_blank">
                                {state.modelInfo?.model}
                            </Link>
                        </ListItem>
                        <ListItem>Version: {state.modelInfo?.version}</ListItem>
                        {state.modelInfo?.drivers.length ? (
                            <>
                                <ListItem>Drivers:</ListItem>
                                <List disablePadding>
                                    {state.modelInfo?.drivers.map((driver) => (
                                        <ListItem key={driver} sx={{ pl: 4 }}>
                                            {driver}
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        ) : (
                            <ListItem>Drivers: -</ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;
