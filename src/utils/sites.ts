import maplibre from 'maplibre-gl';

export const getSitesBounds = (sites: Sites) => {
    const start = sites?.features[0]?.geometry.coordinates;

    if (!start) {
        return new maplibre.LngLatBounds([-180, -90], [180, 90]);
    }

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new maplibre.LngLatBounds(start, start);

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    sites.features.forEach(({ geometry: { coordinates } }) => {
        bounds.extend(coordinates);
    });

    return bounds;
};
