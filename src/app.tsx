import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { StoreContext, initialState, reducers } from './store';
import { theme } from './theme';
import Content from './components/Main/Content';

const App = (): JSX.Element => {
    const store = React.useReducer(reducers, initialState);

    return (
        <StrictMode>
            <LocalizationProvider dateAdapter={DateFnsAdapter}>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <StoreContext.Provider value={store}>
                            <Content />
                        </StoreContext.Provider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </LocalizationProvider>
        </StrictMode>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<App />);
}
