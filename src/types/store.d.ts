interface State {
    isLoading: boolean;
    modelInfo?: ModelInfo;
    sites: GeoJSON.FeatureCollection<GeoJSON.Point, SiteProps>;
    customSites: GeoJSON.FeatureCollection<GeoJSON.Point, SiteProps>;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    cases: CaseWithTaskInfo[];
    variablesConfig: CaseVariableConfig[];
}

interface UpdateLoadingState {
    type: 'updateLoadingState';
    isLoading: boolean;
}

interface UpdateModelInfo {
    type: 'updateModelInfo';
    info: ModelInfo;
}

interface UpdateSites {
    type: 'updateSites';
    sites: Sites;
}

interface UpdateCustomSites {
    type: 'updateCustomSites';
    action: 'add' | 'remove';
    site: {
        lat: number;
        lon: number;
    };
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
    | UpdateModelInfo
    | UpdateSites
    | UpdateCustomSites
    | UpdateSelectedSite
    | UpdateCases
    | UpdateCase
    | DeleteCase
    | UpdateVariablesConfig;
