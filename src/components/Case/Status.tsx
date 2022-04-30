import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import InfoPopover from '../InfoPopover';

interface Props {
    status?: TaskStatus;
    error?: string;
}

const Status = ({ status, error }: Props) => {
    const [infoPopover, updatedInfoPopover] = React.useState<{
        anchor: HTMLElement;
        text: string;
        url?: string;
    } | null>(null);

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
                    onClick={(e) => {
                        error &&
                            updatedInfoPopover({
                                anchor: e.currentTarget,
                                text: error
                            });
                    }}
                >
                    <Icon baseClassName="icons" fontSize="small" color="error">
                        error_outline
                    </Icon>
                </IconButton>
                {infoPopover ? (
                    <InfoPopover
                        anchor={infoPopover.anchor}
                        text={infoPopover.text}
                        url={infoPopover.url}
                        handleClose={() => updatedInfoPopover(null)}
                    />
                ) : null}
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
