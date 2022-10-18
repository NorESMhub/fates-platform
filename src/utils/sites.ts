import maplibre from 'maplibre-gl';

export const getSitesBounds = (siteCollection: GeoJSON.FeatureCollection<GeoJSON.Point, SiteProps>[]) => {
    // The default bounds, in case there are no sites.
    let bounds = new maplibre.LngLatBounds([-180, -90], [180, 90]);

    siteCollection.forEach((site, sIdx) => {
        site.features.forEach(({ geometry: { coordinates } }, fIdx) => {
            if (sIdx === 0 && fIdx === 0) {
                // Set the bounds to the first coordinate.
                bounds = new maplibre.LngLatBounds(coordinates, coordinates);
            } else {
                // Extend the bounds to include the current coordinate.
                bounds.extend(coordinates as maplibregl.LngLatLike);
            }
        });
    });

    return bounds;
};
