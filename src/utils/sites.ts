import maplibre from 'maplibre-gl';

export const getSitesBounds = (siteCollection: GeoJSON.FeatureCollection<GeoJSON.Point, SiteProps>[]) => {
    const start = (siteCollection[0]?.features[0]?.geometry as GeoJSON.Point).coordinates;

    if (!start) {
        return new maplibre.LngLatBounds([-180, -90], [180, 90]);
    }

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new maplibre.LngLatBounds(start, start);

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    siteCollection.forEach((site) => {
        site.features.forEach(({ geometry: { coordinates } }) => {
            bounds.extend(coordinates as maplibregl.LngLatLike);
        });
    });

    return bounds;
};
