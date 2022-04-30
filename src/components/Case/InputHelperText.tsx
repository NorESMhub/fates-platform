import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import InfoPopover from '../InfoPopover';

interface Props {
    description?: VariableDescription;
    errors: string[];
}

const InputHelperText = ({ description, errors }: Props) => {
    const [infoPopover, updatedInfoPopover] = React.useState<{
        anchor: HTMLElement;
        text: string;
        url?: string;
    } | null>(null);

    return (
        <>
            {description ? (
                <>
                    <Typography variant="caption" dangerouslySetInnerHTML={{ __html: description.summary }} />
                    {description.details ? (
                        <>
                            &nbsp;
                            <Link
                                href="#"
                                onClick={(e) => {
                                    description.details &&
                                        updatedInfoPopover({
                                            anchor: e.currentTarget,
                                            text: description.details,
                                            url: description.url
                                        });
                                }}
                            >
                                (read more)
                            </Link>
                            {infoPopover ? (
                                <InfoPopover
                                    anchor={infoPopover.anchor}
                                    text={infoPopover.text}
                                    url={infoPopover.url}
                                    handleClose={() => updatedInfoPopover(null)}
                                />
                            ) : null}
                        </>
                    ) : null}
                </>
            ) : null}
            {errors.length ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }} component="span">
                    {errors.map((error) => (
                        <Typography key={error} variant="caption" component="span">
                            {error}
                        </Typography>
                    ))}
                </Box>
            ) : null}
        </>
    );
};

export default InputHelperText;
