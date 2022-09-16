import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { StoreContext, initialState, reducers } from './store';
import { theme } from './theme';
import Content from './components/Main/Content';

const App = (): JSX.Element => {
    const store = React.useReducer(reducers, initialState);

    return (
        <StrictMode>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <StoreContext.Provider value={store}>
                        <Content />
                    </StoreContext.Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        </StrictMode>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<App />);
}
