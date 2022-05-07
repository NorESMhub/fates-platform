import React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { StoreContext } from '../../store';
import { HEADER_HEIGHT } from '../../theme';
import CasesList from '../Case/List';
import SiteDetails from '../Sites/SiteDetails';
import SitesList from '../Sites/SitesList';
import SitesMap from '../Sites/SitesMap';
import Header from './Header';
import Loading from './Loading';

const Content = (): JSX.Element => {
    const [state, dispatch] = React.useContext(StoreContext);

    const mapRef = React.useRef<maplibregl.Map>();

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
        <>
            <Header />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: `calc(100% - ${HEADER_HEIGHT}px)`
                }}
            >
                {!state.sites ? (
                    <Loading />
                ) : (
                    <>
                        <Box sx={{ display: 'flex', height: '50%' }}>
                            <Box sx={{ width: '50%', overflowY: 'auto', p: 1 }}>
                                {state.selectedSite ? (
                                    <SiteDetails site={state.selectedSite} />
                                ) : (
                                    <SitesList map={mapRef.current} />
                                )}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <SitesMap
                                    onMapReady={(map) => {
                                        mapRef.current = map;
                                    }}
                                />
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ flexGrow: 1, p: 1, overflow: 'auto' }}>
                            {state.selectedSite && !state.isEditingCase ? (
                                <CasesList site={state.selectedSite} />
                            ) : null}
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
};

export default Content;
