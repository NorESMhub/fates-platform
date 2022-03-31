import React from 'react';
import Box from '@mui/material/Box';

import type { SxProps } from '@mui/material/styles';

import { StateContext } from '../store';
import { HEADER_HEIGHT } from '../theme';
import Header from './Header';
import Map from './Map';
import Sidebar from './Sidebar';
import { layerStyles, mapStyle } from './Map/styles';

const styles: { [k: string]: SxProps } = {
    header: {},
    content: {
        display: 'flex',
        height: `calc(100% - ${HEADER_HEIGHT}px)`
    },
    sidebar: {
        width: '34%',
        display: 'flex',
        flexDirection: 'column',
        m: 1
    },
    map: {
        flex: 1
    }
};

interface Refs {
    map?: maplibregl.Map;
    bounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
}

const Home = (): JSX.Element => {
    const { state, dispatch } = React.useContext(StateContext);

    const refs = React.useRef<Refs>({ map: undefined, bounds: state.sitesBounds, selectedSite: undefined });

    const sitesBounds = React.useRef(state.sitesBounds);

    React.useEffect(() => {
        if (refs.current.map) {
            const map = refs.current.map;
            if (refs.current.selectedSite) {
                map.setFeatureState({ source: 'sites', id: refs.current.selectedSite.name }, { selected: false });
            }
            if (state.selectedSite) {
                map.setFeatureState({ source: 'sites', id: state.selectedSite.name }, { selected: true });
            }
        }
        refs.current.selectedSite = state.selectedSite;
    }, [state.selectedSite]);

    const onMapLoad = (map: maplibregl.Map) => {
        map.addSource('sites', {
            type: 'geojson',
            data: state.sites,
            promoteId: 'name'
        });

        map.addLayer({
            ...layerStyles.sites.default,
            id: 'sites',
            source: 'sites'
        } as maplibregl.CircleLayerSpecification);

        map.on('click', 'sites', (e) => {
            if (e.features && e.features[0]) {
                if (e.features.length > 0) {
                    const site =
                        e.features[0].id === refs.current.selectedSite?.name ? undefined : e.features[0].properties;
                    dispatch({
                        type: 'updateSelectedSite',
                        site
                    });
                }
            }
        });

        map.on('mouseenter', 'sites', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'sites', () => {
            map.getCanvas().style.cursor = '';
        });

        refs.current.map = map;
    };

    return (
        <>
            <Header />

            <Box sx={styles.content}>
                <Box sx={styles.sidebar}>
                    <Sidebar />
                </Box>
                <Box sx={styles.map}>
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
            </Box>
        </>
    );
};

export default Home;
