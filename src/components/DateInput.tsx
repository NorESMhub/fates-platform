import React from 'react';
import { IMask, IMaskInput } from 'react-imask';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const DateInputMask = React.forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask={Date}
            pattern="Y-`m-`d"
            blocks={{
                d: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2
                },
                m: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 9999
                }
            }}
            format={(date) => {
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (day < 10) {
                    day = `0${day}`;
                }
                if (month < 10) {
                    month = `0${month}`;
                }
                if (year < 10) {
                    year = `000${year}`;
                } else if (year < 100) {
                    year = `00${year}`;
                } else if (year < 1000) {
                    year = `0${year}`;
                }

                return [year, month, day].join('-');
            }}
            parse={(str) => {
                const [year, month, day] = str.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                if (year < 100) {
                    date.setFullYear(year);
                }
                return date;
            }}
            inputRef={ref}
            onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export default DateInputMask;
