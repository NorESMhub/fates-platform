import React from 'react';

import { ConfigContext, DispatchContext, SelectionContext } from '../../store';
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
    const { dispatch } = React.useContext(DispatchContext);
    const { sitesBounds, sites } = React.useContext(ConfigContext);
    const { selectedSite } = React.useContext(SelectionContext);

    const refs = React.useRef<Refs>({
        map: undefined,
        bounds: sitesBounds,
        selectedSite: undefined
    });

    React.useEffect(() => {
        if (refs.current.map) {
            const map = refs.current.map;
            if (refs.current.selectedSite) {
                map.setFeatureState({ source: 'sites', id: refs.current.selectedSite.name }, { selected: false });
            }
            if (selectedSite) {
                map.setFeatureState({ source: 'sites', id: selectedSite.name }, { selected: true });
            }
        }
        refs.current.selectedSite = selectedSite;
    }, [selectedSite]);

    const onMapLoad = (map: maplibregl.Map) => {
        map.addSource('sites', {
            type: 'geojson',
            data: sites,
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
