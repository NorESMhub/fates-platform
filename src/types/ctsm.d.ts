interface ModelInfo {
    model: string;
    version: string;
    drivers: ModelDriver[];
}

type VariableType = 'char' | 'integer' | 'float' | 'logical' | 'date';

type VariableValue = string | number | boolean | Array<string | number | boolean>;

interface VariableChoice {
    value: VariableValue;
    label: string;
}

interface VariableValidation {
    min?: number;
    max?: number;
    pattern?: string;
    pattern_error?: string;
    choices?: VariableChoice[];
}

type VariableCategory = 'case' | 'xml_var' | 'user_nl_clm' | 'user_nl_clm_history_file' | 'fates' | 'fates_param';

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
    validation?: VariableValidation;
    default?: VariableValue;
    placeholder?: string;
}

interface CaseVariable {
    name: string;
    value: VariableValue;
}

type CaseCreateStatus = 'INITIALISED' | 'CREATED' | 'SETUP' | 'UPDATED' | 'CONFIGURED';

type CaseRUNStatus =
    | 'BUILDING'
    | 'BUILT'
    | 'INPUT_DATA_READY'
    | 'REBUILT'
    | 'FATES_PARAMS_UPDATED'
    | 'FATES INDICES SET'
    | 'SUBMITTED';

type CaseStatus = CaseCreateStatus | CaseRUNStatus;

type ModelDriver = 'mct' | 'nuopc';

interface Case {
    id: string;
    name?: string;
    site?: string;
    model_version: string;
    status: CaseStatus;
    date_created: string;
    create_task_id?: string;
    run_task_id?: string;
    compset: string;
    lat: number;
    lon: number;
    variables: CaseVariable[];
    driver: ModelDriver;
    data_url?: string;
    data_digest: string;
}

interface CaseEditPayload {
    site_name: string;
    case_name?: string;
    variables: CaseVariable[];
    driver: ModelDriver;
}

type TaskRunningStatus = 'PENDING' | 'STARTED' | 'RECEIVED' | 'RETRY';

type TaskFinishedStatus = 'SUCCESS' | 'FAILURE' | 'REVOKED' | 'REJECTED' | 'IGNORED';

type TaskStatus = TaskRunningStatus | TaskFinishedStatus;

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

interface SiteProps extends GeoJSON.GeoJsonProperties {
    name: string;
    description: ?string;
    compset: string;
    data_url: string;
    config?: CaseVariable[];
}
