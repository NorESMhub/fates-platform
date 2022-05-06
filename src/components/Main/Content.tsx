import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { SelectionContext } from '../../store';
import { HEADER_HEIGHT } from '../../theme';
import CasesList from '../Case/List';
import SiteDetails from '../Sites/SiteDetails';
import SitesList from '../Sites/SitesList';
import SitesMap from '../Sites/SitesMap';
import Header from './Header';

const Content = (): JSX.Element => {
    const { selectedSite } = React.useContext(SelectionContext);

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
                <Box sx={{ display: 'flex', height: '50%' }}>
                    <Box sx={{ width: '50%', overflowY: 'auto', p: 1 }}>
                        {selectedSite ? <SiteDetails site={selectedSite} /> : <SitesList map={mapRef.current} />}
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
                    {selectedSite ? <CasesList site={selectedSite} /> : null}
                </Box>
            </Box>
        </>
    );
};

export default Content;
