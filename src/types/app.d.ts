interface PopoverProps {
    anchor?: HTMLElement;
    text?: string;
    url?: string;
}

interface SchemaError {
    loc: string[];
    msg: string;
    type: string;
}

type HTTPError = string | SchemaError[];
