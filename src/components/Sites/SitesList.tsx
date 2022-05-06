import React from 'react';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { ConfigContext, DispatchContext } from '../../store';

interface Props {
    map?: maplibregl.Map;
}

const SitesList = ({ map }: Props) => {
    const { dispatch } = React.useContext(DispatchContext);
    const { sites } = React.useContext(ConfigContext);

    const hoveredSiteRefs = React.useRef<string>();

    const handleSiteClick = (site: SiteProps) => {
        dispatch({ type: 'updateSelectedSite', site });
        handleSiteMouseLeave();
    };

    const handleSiteMouseEnter = (siteId: string) => {
        if (map) {
            if (hoveredSiteRefs.current) {
                map.setFeatureState({ source: 'sites', id: hoveredSiteRefs.current }, { hovered: false });
            }
            map.setFeatureState({ source: 'sites', id: siteId }, { hovered: true });
            hoveredSiteRefs.current = siteId;
        }
    };

    const handleSiteMouseLeave = () => {
        if (map) {
            if (hoveredSiteRefs.current) {
                map.setFeatureState({ source: 'sites', id: hoveredSiteRefs.current }, { hovered: false });
                hoveredSiteRefs.current = undefined;
            }
        }
    };

    return (
        <>
            <Typography variant="h4">Sites</Typography>
            <Alert sx={{ m: 1 }} severity="info">
                Start by selecting a site from the list below or on the map.
            </Alert>
            {sites &&
                sites.features.map(({ properties }) => (
                    <Chip
                        key={properties.name}
                        sx={{ m: 1 }}
                        label={properties.name}
                        variant="outlined"
                        onClick={() => handleSiteClick(properties)}
                        onMouseEnter={() => handleSiteMouseEnter(properties.name)}
                        onMouseLeave={handleSiteMouseLeave}
                    />
                ))}
        </>
    );
};

export default SitesList;
