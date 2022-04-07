import axios from 'axios';
import React, { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { StateContext, initialState, reducers } from './store';
import { theme } from './theme';
import Content from './components/Main/Content';
import Loading from './components/Main/Loading';

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
            .get<Sites>(`${API_PATH}/sites`)
            .then(({ data }) => {
                dispatch({ type: 'updateSites', sites: data });
            })
            .catch(console.error);

        axios.get<CaseAllowedVariable[]>(`${API_PATH}/cases/allowed_vars`).then(({ data }) => {
            dispatch({ type: 'updateAllowedVars', vars: data });
        });
    }, []);

    return (
        <StrictMode>
            <LocalizationProvider dateAdapter={DateFnsAdapter}>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <StateContext.Provider value={stateContextValue}>
                            <Suspense fallback={<Loading />}>{state.sites ? <Content /> : <Loading />}</Suspense>
                        </StateContext.Provider>
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
