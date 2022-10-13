interface State {
    isLoading: boolean;
    ctsmInfo?: CTSMInfo;
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    cases: CaseWithTaskInfo[];
    variablesConfig: CaseVariableConfig[];
}

interface UpdateLoadingState {
    type: 'updateLoadingState';
    isLoading: boolean;
}

interface UpdateCTSMInfo {
    type: 'updateCTSMInfo';
    info: CTSMInfo;
}

interface UpdateSites {
    type: 'updateSites';
    sites: Sites;
}

interface UpdateSelectedSite {
    type: 'updateSelectedSite';
    site?: SiteProps;
}

interface UpdateCases {
    type: 'updateCases';
    cases: CaseWithTaskInfo[];
}

interface UpdateCase {
    type: 'updateCase';
    case: CaseWithTaskInfo;
}

interface DeleteCase {
    type: 'deleteCase';
    case: CaseWithTaskInfo;
}

interface UpdateVariablesConfig {
    type: 'updateVariablesConfig';
    vars: CaseVariableConfig[];
}

type Action =
    | UpdateLoadingState
    | UpdateCTSMInfo
    | UpdateSites
    | UpdateSelectedSite
    | UpdateCases
    | UpdateCase
    | DeleteCase
    | UpdateVariablesConfig;
