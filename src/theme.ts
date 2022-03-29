import { createTheme } from '@mui/material/styles';

export const themeOptions = {
    palette: {
        primary: {
            dark: '#002e2c',
            main: '#024654',
            light: '#035e7b',
            contrastText: '#fff'
        },
        secondary: {
            dark: '#e3e7af',
            main: '#a2a77f',
            light: '#eff1c5',
            contrastText: '#fff'
        }
    },
    typography: {
        fontFamily: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(',')
    }
};

export const theme = createTheme(themeOptions);
