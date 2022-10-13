import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = (): JSX.Element => (
    <Box
        sx={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.5)'
        }}
    >
        <CircularProgress />
    </Box>
);

export default Loading;
