import React from 'react';
import Button from '@mui/material/Button';

import { StateContext } from '../store';
import Sites from './Sites';
import SiteDetails from './SiteDetails';

const Sidebar = () => {
    const { state, dispatch } = React.useContext(StateContext);

    return (
        <>
            {state.selectedSite ? (
                <>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => dispatch({ type: 'updateSelectedSite', site: undefined })}
                    >
                        Back
                    </Button>
                    <SiteDetails site={state.selectedSite} />
                </>
            ) : (
                <Sites />
            )}
        </>
    );
};

export default Sidebar;
