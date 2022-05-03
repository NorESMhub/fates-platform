interface SchemaError {
    loc: string[];
    msg: string;
    type: string;
}

type HTTPError = string | SchemaError[];
