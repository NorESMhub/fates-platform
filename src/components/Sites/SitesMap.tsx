import React from 'react';

import { StoreContext } from '../../store';
import Map from '../Map';
import { basemaps, layerStyles, mapStyle } from '../Map/styles';

interface Refs {
    map?: maplibregl.Map;
    bounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
}

interface Props {
    onMapReady: (map: maplibregl.Map) => void;
}

const SitesMap = ({ onMapReady }: Props) => {
    const [state, dispatch] = React.useContext(StoreContext);

    const refs = React.useRef<Refs>({
        map: undefined,
        bounds: state.sitesBounds,
        selectedSite: undefined
    });

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
            if (e.features && e.features.length > 0) {
                const site =
                    e.features[0].id === refs.current.selectedSite?.name
                        ? undefined
                        : (e.features[0].properties as SiteProps);
                dispatch({
                    type: 'updateSelectedSite',
                    site
                });
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
        onMapReady(map);
    };
    return (
        <Map
            mapOptions={{
                style: mapStyle,
                minZoom: 1,
                fitBoundsOptions: {
                    padding: 100
                }
            }}
            initialBounds={refs.current.bounds}
            attribution
            basemaps={basemaps}
            help
            navigation
            onLoad={onMapLoad}
        />
    );
};

export default SitesMap;
