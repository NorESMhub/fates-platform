import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { StoreContext } from '../../store';
import CaseEdit from '../Case/CaseEdit';

interface Props {
    map?: maplibregl.Map;
}

const SitesList = ({ map }: Props) => {
    const [state, dispatch] = React.useContext(StoreContext);

    const [editCase, updatedEditCase] = React.useState(false);

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
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4">Sites</Typography>
                <Alert sx={{ m: 1 }} severity="info">
                    Start by selecting a site from the list below or on the map. See also our&nbsp;
                    <a href="https://noresmhub.github.io/noresm-land-sites-platform/user_guide/">User guide</a>,&nbsp;
                    <a href="https://noresmhub.github.io/noresm-land-sites-platform/">Technical documentation</a>{' '}
                    and&nbsp;
                    <a href="https://noresmhub.github.io/noresm-land-sites-platform/land-sites/">site overview</a>.
                </Alert>
                {state.sites &&
                    state.sites.features.map(({ properties }) => (
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
                    <Button
                        sx={{ ml: 1 }}
                        variant="outlined"
                        color="primary"
                        disabled={editCase}
                        onClick={() => updatedEditCase(true)}
                    >
                        Create Case for Custom Site
                    </Button>
                </Box>
            </Box>
            {editCase ? <CaseEdit initialVariables={{}} handleClose={() => updatedEditCase(false)} /> : null}
        </>
    );
};

export default SitesList;
