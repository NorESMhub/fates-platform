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

type CaseStatus = 'INITIALISED' | 'CREATED' | 'UPDATED' | 'SETUP' | 'BUILT' | 'SUBMITTED' | 'SUCCEEDED' | 'FAILED';

interface Case {
    id: string;
    compset: string;
    res: string;
    variables: {
        [key: string]: any;
    };
    driver: 'mct' | 'nuopc';
    data_url: string;
    ctsm_tag: string;
    status: CaseStatus;
    date_created: Date;
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
    result: any;
    error?: string;
}

interface CaseWithTaskInfo extends Case {
    task: Task;
}
