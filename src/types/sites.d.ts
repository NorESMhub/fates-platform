interface SiteProps {
    name: string;
    description: ?string;
    compset: string;
    res: string;
    url: string;
}

interface Sites {
    type: 'FeatureCollection';
    features: Array<{
        type: 'Feature';
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        };
        properties: SiteProps;
    }>;
}
