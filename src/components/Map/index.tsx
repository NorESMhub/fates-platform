import React from 'react';
import maplibre from 'maplibre-gl';
import BasemapsControl, { MapLibreBasemapsControlOptions } from 'maplibre-gl-basemaps';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { StoreContext } from '../../store';
import { MapControl } from './Control';
import Help from './Help';

interface Props {
    mapOptions: Partial<maplibregl.MapOptions>;
    attribution?: boolean;
    basemaps?: MapLibreBasemapsControlOptions;
    help?: boolean;
    navigation?: boolean;
    onLoad: (map: maplibregl.Map) => void;
}

const Map = ({ mapOptions, attribution, basemaps, help, navigation, onLoad }: Props): JSX.Element => {
    const [state] = React.useContext(StoreContext);

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibregl.Map>();
    const boundsRef = React.useRef<maplibregl.LngLatBoundsLike>(state.sitesBounds);

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showHelp, updateShowHelp] = React.useState(false);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                bounds: state.sitesBounds,
                attributionControl: !attribution,
                ...mapOptions
            } as maplibregl.MapOptions);

            if (attribution) {
                map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-right');
            }

            if (navigation) {
                map.addControl(new maplibre.NavigationControl({}));
                if (resetPitchButtonRef.current) {
                    map.addControl(new MapControl(resetPitchButtonRef.current));
                }
                if (resetBoundsButtonRef.current) {
                    map.addControl(new MapControl(resetBoundsButtonRef.current));
                }
            }

            if (basemaps) {
                map.addControl(new BasemapsControl(basemaps), 'bottom-left');
            }

            if (help && helpButtonRef.current) {
                map.addControl(new MapControl(helpButtonRef.current), 'bottom-right');
            }

            map.on('load', () => {
                onLoad(map);
            });
            mapRef.current = map;
        }
    }, []);

    React.useEffect(() => {
        boundsRef.current = state.sitesBounds;
    }, [state.sitesBounds]);

    return (
        <Box ref={mapContainerRef} sx={{ height: '100%', width: '100%' }}>
            {maplibre.supported() ? null : 'Your browser does not support the map features.'}

            {navigation ? (
                <>
                    <Box ref={resetPitchButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset map pitch"
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current.easeTo({ pitch: 0 });
                                }
                            }}
                        >
                            <Icon baseClassName="icons">360</Icon>
                        </button>
                    </Box>

                    <Box ref={resetBoundsButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset map bounds"
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current?.fitBounds(boundsRef.current, mapOptions.fitBoundsOptions || {});
                                }
                            }}
                        >
                            <Icon baseClassName="icons">zoom_out_map</Icon>
                        </button>
                    </Box>
                </>
            ) : null}

            {help ? (
                <Box ref={helpButtonRef} className="maplibregl-ctrl-group">
                    <button type="button" title="How to navigate the map" onClick={() => updateShowHelp(true)}>
                        <Icon baseClassName="icons">question_mark</Icon>
                    </button>
                    <Help open={showHelp} onClose={() => updateShowHelp(false)} />
                </Box>
            ) : null}
        </Box>
    );
};

export default Map;
