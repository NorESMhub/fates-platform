import { MapLibreBasemapsControlOptions } from 'maplibre-gl-basemaps';

export const basemaps = {
    basemaps: [
        {
            id: 'OSM',
            tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            sourceExtraParams: {
                attribution:
                    '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.'
            }
        },
        {
            id: 'Carto',
            tiles: [
                'https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                'https://d.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
            ],
            sourceExtraParams: {
                attribution: '&#169; <a href="https://www.carto.com">Carto</a>'
            }
        },
        {
            id: 'World_Imagery',
            tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            sourceExtraParams: {
                attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            }
        }
    ],
    initialBasemap: 'OSM',
    expandDirection: 'top'
} as MapLibreBasemapsControlOptions;

export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.LayerSpecification> } } = {
    sites: {
        default: {
            type: 'circle',
            paint: {
                'circle-radius': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    10,
                    ['boolean', ['feature-state', 'hovered'], false],
                    10,
                    7
                ],
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    '#ff0000',
                    ['boolean', ['feature-state', 'hovered'], false],
                    '#e75c06',
                    '#bf8e14'
                ],
                'circle-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    0.5,
                    ['boolean', ['feature-state', 'hovered'], false],
                    0.5,
                    1
                ]
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {},
    layers: []
};
