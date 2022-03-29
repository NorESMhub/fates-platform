import React from 'react';
import Box from '@mui/material/Box';

import type { SxProps } from '@mui/system';

import Map from '../Map';
import { layerStyles, mapStyle } from '../Map/styles';
import { getSitesBounds } from '../../utils/sites';

const styles: { [k: string]: SxProps } = {};

interface Props {
    sites: Sites;
}

const Home = ({ sites }: Props): JSX.Element => {
    const mapRef = React.useRef<maplibregl.Map>();
    const [isMapLoaded, setIsMapLoaded] = React.useState(false);

    const sitesBounds = React.useRef(getSitesBounds(sites));

    const onMapLoad = (map: maplibregl.Map) => {
        map.addSource('sites', {
            type: 'geojson',
            data: sites
        });

        map.addLayer({
            ...layerStyles.sites.default,
            id: 'sites',
            source: 'sites'
        } as maplibregl.CircleLayerSpecification);

        mapRef.current = map;
        setIsMapLoaded(true);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', m: 'auto' }}>
            <Map
                mapOptions={{
                    style: mapStyle,
                    minZoom: 1,
                    fitBoundsOptions: {
                        padding: 100
                    }
                }}
                initialBounds={sitesBounds.current}
                attribution
                help
                navigation
                onLoad={onMapLoad}
            />
        </Box>
    );
};

export default Home;
