interface State {
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
    allowedVars: CTSMAllowedVars[];
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

interface UpdateAllowedVars {
    type: 'updateAllowedVars';
    vars: CTSMAllowedVars[];
}

type Action = UpdateSites | UpdateSelectedSite | UpdateSelectedSiteCases | UpdateAllowedVars;

interface StoreContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}
