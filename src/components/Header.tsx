import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { HEADER_HEIGHT } from '../theme';

const Header = () => (
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
            <Typography sx={{ marginRight: 2 }} variant="h4">
                FATES Platform
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Header;
