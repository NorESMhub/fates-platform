type CTSMVarType = 'char' | 'integer' | 'logical' | 'date';

type CTSMVarValue = string | number | boolean | Array<string | number | boolean>;

interface CTSMVars {
    [key: string]: CTSMVarValue | undefined;
}

interface CTSMAllowedVars {
    name: string;
    type: CTSMVarType;
    choices?: Array<string | number>;
    allow_multiple: boolean;
    description?: string;
    default?: string | number | boolean;
}

type CaseStatus = 'INITIALISED' | 'CREATED' | 'UPDATED' | 'SETUP' | 'BUILT' | 'SUBMITTED' | 'SUCCEEDED' | 'FAILED';

interface Case {
    id: string;
    compset: string;
    res: string;
    variables: CTSMVars;
    driver: 'mct' | 'nuopc';
    data_url: string;
    ctsm_tag: string;
    status: CaseStatus;
    date_created: string;
    task_id?: string;
}

type TaskStatus =
    | 'PENDING'
    | 'STARTED'
    | 'SUCCESS'
    | 'FAILURE'
    | 'REVOKED'
    | 'RECEIVED'
    | 'REJECTED'
    | 'RETRY'
    | 'IGNORED';

interface Task {
    task_id: string;
    status: TaskStatus;
    result: string;
    error?: string;
}

interface CaseWithTaskInfo extends Case {
    task: Task;
}

interface SiteProps {
    name: string;
    description: ?string;
    compset: string;
    res: string;
    url: string;
}

interface Sites {
    type: 'FeatureCollection';
    features: Array<{
        type: 'Feature';
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        };
        properties: SiteProps;
        id: string;
    }>;
}
