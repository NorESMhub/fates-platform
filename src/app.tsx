import React, { StrictMode } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Icon from '@mui/material/Icon';
import { StoreContext, initialState, reducers } from './store';
import { theme } from './theme';
import Content from './components/Main/Content';

interface ReadyState {
    model: 'loading' | 'ready' | 'error';
    sites: 'loading' | 'ready' | 'error';
    cases: 'loading' | 'ready' | 'error';
    variables: 'loading' | 'ready' | 'error';
}

const App = (): JSX.Element => {
    const store = React.useReducer(reducers, initialState);
    const dispatch = store[1];

    const [readyState, updateReadyState] = React.useState<ReadyState>({
        model: 'loading',
        sites: 'loading',
        cases: 'loading',
        variables: 'loading'
    });
    const [hasAPIError, updateHasAPIError] = React.useState(false);

    const handleReadyState = <R,>(url: string, category: keyof ReadyState, callback: (data: R) => void) => {
        axios
            .get<R>(url)
            .then(({ data }) => {
                callback(data);
                updateReadyState((prevState) => ({
                    ...prevState,
                    [category]: 'ready'
                }));
            })
            .catch((error) => {
                console.error(error);
                updateReadyState((prevState) => ({
                    ...prevState,
                    [category]: 'error'
                }));
                updateHasAPIError(true);
            });
    };

    React.useEffect(() => {
        dispatch({
            type: 'updateLoadingState',
            isLoading: true
        });

        handleReadyState<ModelInfo>(`${API_PATH}/cases/model-info`, 'model', (info) => {
            dispatch({ type: 'updateModelInfo', info });
        });

        handleReadyState<GeoJSON.FeatureCollection<GeoJSON.Point, SiteProps>>(`${API_PATH}/sites`, 'sites', (sites) => {
            dispatch({ type: 'updateSites', sites });
        });

        handleReadyState<CaseWithTaskInfo[]>(`${API_PATH}/cases`, 'cases', (cases) => {
            dispatch({ type: 'updateCases', cases });
        });

        handleReadyState<CaseVariableConfig[]>(`${API_PATH}/cases/variables`, 'variables', (vars) => {
            dispatch({ type: 'updateVariablesConfig', vars });
        });
    }, []);

    React.useEffect(() => {
        if (
            hasAPIError ||
            (readyState.model === 'ready' &&
                readyState.sites === 'ready' &&
                readyState.cases === 'ready' &&
                readyState.variables === 'ready')
        ) {
            dispatch({
                type: 'updateLoadingState',
                isLoading: false
            });
        }
    }, [readyState, hasAPIError]);

    return (
        <StrictMode>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <StoreContext.Provider value={store}>
                        {hasAPIError ? (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    width: '100%'
                                }}
                            >
                                <Icon baseClassName="icons" fontSize="small" color="error">
                                    error_outline
                                </Icon>
                                Cannot connect to API.&nbsp;
                                Try again in a few minutes. If the error persists, check the state of API docker service.
                            </Box>
                        ) : (
                            <Content />
                        )}
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
