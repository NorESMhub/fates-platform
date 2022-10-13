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
                const day = date.getDate();
                let day_str = day.toString();
                const month = date.getMonth() + 1;
                let month_str = month.toString();
                const year = date.getFullYear();
                let year_str = year.toString();

                if (day < 10) {
                    day_str = `0${day}`;
                }
                if (month < 10) {
                    month_str = `0${month}`;
                }
                if (year < 10) {
                    year_str = `000${year}`;
                } else if (year < 100) {
                    year_str = `00${year}`;
                } else if (year < 1000) {
                    year_str = `0${year}`;
                }

                return [year_str, month_str, day_str].join('-');
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
