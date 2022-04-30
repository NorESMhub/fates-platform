interface State {
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
    variablesConfig: CaseVariableConfig[];
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
    cases?: CaseWithTaskInfo[];
}

interface UpdateVariablesConfig {
    type: 'updateVariablesConfig';
    vars: CaseVariableConfig[];
}

type Action = UpdateSites | UpdateSelectedSite | UpdateSelectedSiteCases | UpdateVariablesConfig;

interface StoreContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}
