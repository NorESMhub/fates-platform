import React from 'react';
import Icon from '@mui/material/Icon';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Props {
    anchor: HTMLElement;
    text: string;
    url?: string;
    handleClose: () => void;
}

const InfoPopover = ({ anchor, text, url, handleClose }: Props) => {
    return (
        <Popover
            open={Boolean(anchor)}
            disableRestoreFocus
            anchorEl={anchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            onClose={handleClose}
        >
            <Stack sx={{ p: 1, maxWidth: 300 }} direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" dangerouslySetInnerHTML={{ __html: text }} />
                {url ? (
                    <Link href={url} target="_blank" rel="noopener,noreferrer">
                        <Icon baseClassName="icons" fontSize="small">
                            launch
                        </Icon>
                    </Link>
                ) : null}
            </Stack>
        </Popover>
    );
};

export default InfoPopover;
