import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';
import CaseEdit from '../Case/Edit';

interface Props {
    site: SiteProps;
}

const Details = ({ site }: Props) => {
    const { dispatch } = React.useContext(StateContext);
    const [editCase, updatedEditCase] = React.useState(false);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => dispatch({ type: 'updateSelectedSite', site: undefined })}
                >
                    Back
                </Button>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
                    <Button component="a" href={site.url} variant="outlined">
                        Download Site Data
                    </Button>
                    <Button
                        sx={{ ml: 1 }}
                        variant="outlined"
                        color="primary"
                        disabled={editCase}
                        onClick={() => updatedEditCase(true)}
                    >
                        Create Case
                    </Button>
                </Box>
            </Box>

            <Card sx={{ m: 1 }} elevation={0}>
                <CardContent>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="h6">{site.name}</Typography>
                    </Box>
                    {site.description && (
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body1">{site.description}</Typography>
                        </Box>
                    )}
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">Compset:</Typography>
                        <Typography variant="caption" paragraph>
                            {site.compset}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">Grid:</Typography>
                        <Typography variant="caption" paragraph>
                            {site.res}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            {editCase ? <CaseEdit initialVariables={{}} handleClose={() => updatedEditCase(false)} /> : null}
        </>
    );
};

export default Details;
