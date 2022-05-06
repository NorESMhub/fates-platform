interface State {
    ctsmInfo?: CTSMInfo;
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
    variablesConfig: CaseVariableConfig[];
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

interface UpdateSelectedSiteCases {
    type: 'updateSelectedSiteCases';
    cases: CaseWithTaskInfo[];
}

interface UpdateSelectedSiteCase {
    type: 'updateSelectedSiteCase';
    case: CaseWithTaskInfo;
}

interface DeleteSelectedSiteCase {
    type: 'deleteSelectedSiteCase';
    case: CaseWithTaskInfo;
}

interface UpdateVariablesConfig {
    type: 'updateVariablesConfig';
    vars: CaseVariableConfig[];
}

type Action =
    | UpdateCTSMInfo
    | UpdateSites
    | UpdateSelectedSite
    | UpdateSelectedSiteCases
    | UpdateSelectedSiteCase
    | DeleteSelectedSiteCase
    | UpdateVariablesConfig;

interface DispatchContext {
    dispatch: React.Dispatch<Action>;
}

interface ConfigContext {
    ctsmInfo?: CTSMInfo;
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    variablesConfig: CaseVariableConfig[];
}

interface SelectionContext {
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
}
