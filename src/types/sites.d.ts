type VariableType = 'char' | 'integer' | 'float' | 'logical' | 'date';

type VariableValue = string | number | boolean | Array<string | number | boolean>;

interface VariableValidation {
    min?: number;
    max?: number;
    pattern?: string;
    choices?: Array<string | number>;
}

type VariableCategory = 'ctsm_xml' | 'ctsm_nl_lnd' | 'fates';

interface CaseVariableConfig {
    name: string;
    category: VariableCategory;
    type: VariableType;
    description?: string;
    readonly?: boolean;
    allow_multiple?: boolean;
    validation?: VariableValidation;
    default?: VariableValue;
}

interface CaseVariable {
    name: string;
    value: VariableValue;
}

type CaseStatus = 'INITIALISED' | 'CREATED' | 'UPDATED' | 'SETUP' | 'BUILT' | 'SUBMITTED';

type CTSMDriver = 'mct' | 'nuopc';

interface Case {
    id: string;
    compset: string;
    res: string;
    variables: CaseVariable[];
    driver: CTSMDriver;
    data_url: string;
    ctsm_tag: string;
    status: CaseStatus;
    date_created: string;
    task_id?: string;
}

interface CaseEditPayload {
    site_name: string;
    variables: CaseVariable[];
    driver: CTSMDriver;
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
