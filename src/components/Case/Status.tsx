import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { StateContext } from '../../store';

interface Props {
    status?: TaskStatus;
    error?: string;
}

const Status = ({ status, error }: Props) => {
    const { dispatch } = React.useContext(StateContext);

    if (!status) {
        return (
            <Typography component="span" variant="caption">
                -
            </Typography>
        );
    }

    if (status === 'FAILURE') {
        return (
            <>
                <Typography component="span" variant="caption">
                    Failed
                </Typography>
                <IconButton
                    size="small"
                    onClick={(e) =>
                        dispatch({
                            type: 'updatePopover',
                            popover: {
                                anchor: e.currentTarget,
                                text: error
                            }
                        })
                    }
                >
                    <Icon baseClassName="icons" fontSize="small" color="error">
                        error_outline
                    </Icon>
                </IconButton>
            </>
        );
    }
    if (status === 'SUCCESS') {
        return (
            <>
                <Typography component="span" variant="caption">
                    Ready
                </Typography>
                <Icon baseClassName="icons" fontSize="small" color="success">
                    check_circle_outline
                </Icon>
            </>
        );
    }
    return (
        <>
            <Typography component="span" variant="caption">
                {status}
            </Typography>
            <CircularProgress size={20} />
        </>
    );
};

export default Status;
