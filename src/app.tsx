import axios from 'axios';
import React, { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { StateContext, initialState, reducers } from './store';
import { theme } from './theme';
import Home from './components/Home';
import Loading from './components/Loading';

const App = (): JSX.Element => {
    const [state, dispatch] = React.useReducer(reducers, initialState);
    const stateContextValue = React.useMemo(
        () => ({
            state,
            dispatch
        }),
        [state]
    );

    React.useEffect(() => {
        axios
            .get(`${API_PATH}/sites`)
            .then(({ data }) => {
                dispatch({ type: 'updateSites', sites: data });
            })
            .catch(console.error);

        axios.get(`${API_PATH}/cases/allowed_vars`).then(({ data }) => {
            dispatch({ type: 'updateAllowedVars', vars: data });
        });
    }, []);

    return (
        <StrictMode>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <StateContext.Provider value={stateContextValue}>
                        <Suspense fallback={<Loading />}>{state.sites ? <Home /> : <Loading />}</Suspense>
                    </StateContext.Provider>
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
