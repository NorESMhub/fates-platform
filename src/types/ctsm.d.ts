interface CTSMInfo {
    model: string;
    version: string;
}

type VariableType = 'char' | 'integer' | 'float' | 'logical' | 'date';

type VariableValue = string | number | boolean | Array<string | number | boolean>;

interface VariableValidation {
    min?: number;
    max?: number;
    pattern?: string;
    choices?: Array<string | number>;
}

type VariableCategory = 'ctsm_xml' | 'user_nl_clm' | 'fates' | 'fates_param';

interface VariableDescription {
    summary: string;
    details?: string;
    url?: string;
}

interface CaseVariableConfig {
    name: string;
    label?: string;
    category: VariableCategory;
    type: VariableType;
    description?: VariableDescription;
    readonly?: boolean;
    hidden?: boolean;
    allow_multiple?: boolean;
    allow_custom?: boolean;
    count_depends_on?: string;
    validation?: VariableValidation;
    default?: VariableValue;
}

interface CaseVariable {
    name: string;
    value: VariableValue;
}

type CaseStatus =
    | 'INITIALISED'
    | 'CREATED'
    | 'SETUP'
    | 'UPDATED'
    | 'FATES INDICES SET'
    | 'CONFIGURED'
    | 'BUILDING'
    | 'BUILT'
    | 'SUBMITTED';

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
    create_task_id?: string;
    run_task_id?: string;
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
    task_id?: string;
    status?: TaskStatus;
    result?: string;
    error?: string;
}

interface CaseWithTaskInfo extends Case {
    create_task: Task;
    run_task: Task;
}

interface SiteProps {
    name: string;
    description: ?string;
    compset: string;
    res: string;
    url: string;
    config?: CaseVariable[];
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
