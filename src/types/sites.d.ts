type CTSMVarType = 'char' | 'integer' | 'logical' | 'date';

type CTSMVarValue = string | number | boolean | Array<string | number | boolean>;

interface CTSMVars {
    [key: string]: CTSMVarValue | undefined;
}

interface VariableValidation {
    min?: number;
    max?: number;
    pattern?: string;
    choices?: Array<string | number>;
    allow_multiple?: boolean;
}

type VariableCategory = 'ctsm_xml' | 'ctsm_nl_lnd' | 'fates';

interface CaseAllowedVariable {
    name: string;
    category: VariableCategory;
    type: CTSMVarType;
    validation?: VariableValidation;
    description?: string;
    default?: CTSMVarValue;
    value?: CTSMVarValue;
}

type CaseStatus = 'INITIALISED' | 'CREATED' | 'UPDATED' | 'SETUP' | 'BUILT' | 'SUBMITTED';

interface Case {
    id: string;
    compset: string;
    res: string;
    variables: CaseAllowedVars[];
    driver: 'mct' | 'nuopc';
    data_url: string;
    ctsm_tag: string;
    status: CaseStatus;
    date_created: string;
    task_id?: string;
}

interface CaseEditPayload {
    site_name: string;
    variables: CaseAllowedVariable[];
    driver: 'mct' | 'nuopc';
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
