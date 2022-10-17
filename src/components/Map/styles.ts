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
                    '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.',
                tileSize: 256
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
                attribution: '&#169; <a href="https://www.carto.com">Carto</a>',
                tileSize: 256
            }
        },
        {
            id: 'World_Imagery',
            tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            sourceExtraParams: {
                attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
                tileSize: 256
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
                    12,
                    ['boolean', ['feature-state', 'hovered'], false],
                    12,
                    5
                ],
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    '#ff0000',
                    ['boolean', ['feature-state', 'hovered'], false],
                    '#e75c06',
                    '#39B54A'
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
    },
    customSites: {
        default: {
            type: 'circle',
            paint: {
                'circle-radius': 5,
                'circle-color': '#8C1ACE'
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {},
    layers: []
};
