import React from 'react';

import { StoreContext } from '../../store';
import Map from '../Map';
import { basemaps, layerStyles, mapStyle } from '../Map/styles';
import SitesLegend from './SitesLegend';

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
    const [isMapLoaded, setIsMapLoaded] = React.useState(false);

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

    React.useEffect(() => {
        const map = refs.current.map;
        if (map && isMapLoaded && state.sitesBounds) {
            map.fitBounds(state.sitesBounds, { padding: 100 });
        }
        refs.current.bounds = state.sitesBounds;
    }, [state.sitesBounds, isMapLoaded]);

    React.useEffect(() => {
        const map = refs.current.map;
        if (map && isMapLoaded && state.sites) {
            const sitesSource = map.getSource('sites') as maplibregl.GeoJSONSource;
            if (sitesSource) {
                sitesSource.setData(state.sites);
            }
        }
    }, [state.sites, isMapLoaded]);

    React.useEffect(() => {
        const map = refs.current.map;

        if (map && isMapLoaded) {
            const customSitesSource = map.getSource('customSites') as maplibregl.GeoJSONSource;
            if (customSitesSource) {
                customSitesSource.setData(state.customSites);
            }
        }
    }, [state.customSites, isMapLoaded]);

    const onMapLoad = (map: maplibregl.Map) => {
        ['sites', 'customSites'].forEach((sourceId) => {
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
                promoteId: 'name'
            });

            map.addLayer({
                ...layerStyles[sourceId].default,
                id: sourceId,
                source: sourceId
            } as maplibregl.CircleLayerSpecification);
        });

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
        setIsMapLoaded(true);
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
            attribution
            basemaps={basemaps}
            help
            navigation
            legends={<SitesLegend />}
            onLoad={onMapLoad}
        />
    );
};

export default SitesMap;
