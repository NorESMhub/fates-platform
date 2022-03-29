import axios from 'axios';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme';
import Home from './components/Home';
import Loading from './components/Loading';

const App = (): JSX.Element => {
    const [sites, updateSites] = React.useState<Site>();

    React.useEffect(() => {
        axios
            .get(`${API_PATH}/sites`)
            .then(({ data }) => {
                updateSites(data);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Suspense fallback={<Loading />}>{sites ? <Home sites={sites} /> : <Loading />}</Suspense>
                </ThemeProvider>
            </StyledEngineProvider>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
