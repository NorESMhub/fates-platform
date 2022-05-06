import axios from 'axios';
import React, { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { DispatchContext, ConfigContext, SelectionContext, initialState, reducers } from './store';
import { theme } from './theme';
import Content from './components/Main/Content';
import Loading from './components/Main/Loading';

const App = (): JSX.Element => {
    const [state, dispatch] = React.useReducer(reducers, initialState);

    const dispatchContextValue = React.useMemo(
        () => ({
            dispatch
        }),
        []
    );
    const configContextValue = React.useMemo(
        () => ({
            ctsmInfo: state.ctsmInfo,
            sites: state.sites,
            sitesBounds: state.sitesBounds,
            variablesConfig: state.variablesConfig
        }),
        [state.ctsmInfo, state.sites, state.sitesBounds, state.variablesConfig]
    );
    const selectionContextValue = React.useMemo(
        () => ({
            selectedSite: state.selectedSite,
            selectedSiteCases: state.selectedSiteCases
        }),
        [state.selectedSite, state.selectedSiteCases]
    );

    React.useEffect(() => {
        axios.get<CTSMInfo>(`${API_PATH}/cases/ctsm-info`).then(({ data }) => {
            dispatch({
                type: 'updateCTSMInfo',
                info: data
            });
        });

        axios
            .get<Sites>(`${API_PATH}/sites`)
            .then(({ data }) => {
                dispatch({ type: 'updateSites', sites: data });
            })
            .catch(console.error);

        axios.get<CaseVariableConfig[]>(`${API_PATH}/cases/variables`).then(({ data }) => {
            dispatch({ type: 'updateVariablesConfig', vars: data });
        });
    }, []);

    return (
        <StrictMode>
            <LocalizationProvider dateAdapter={DateFnsAdapter}>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <DispatchContext.Provider value={dispatchContextValue}>
                            <ConfigContext.Provider value={configContextValue}>
                                <SelectionContext.Provider value={selectionContextValue}>
                                    <Suspense fallback={<Loading />}>
                                        {state.sites ? <Content /> : <Loading />}
                                    </Suspense>
                                </SelectionContext.Provider>
                            </ConfigContext.Provider>
                        </DispatchContext.Provider>
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
