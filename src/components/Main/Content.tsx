import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { StoreContext } from '../../store';
import { HEADER_HEIGHT } from '../../theme';
import CasesList from '../Case/CaseList';
import SiteDetails from '../Sites/SiteDetails';
import SitesList from '../Sites/SitesList';
import SitesMap from '../Sites/SitesMap';
import Header from './Header';
import Loading from './Loading';

const Content = (): JSX.Element => {
    const [state] = React.useContext(StoreContext);

    const mapRef = React.useRef<maplibregl.Map>();

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
                {state.isLoading ? <Loading /> : null}

                <Box sx={{ display: 'flex', height: '50%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', overflowY: 'auto', p: 1 }}>
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
                    <CasesList />
                </Box>
            </Box>
        </>
    );
};

export default Content;
