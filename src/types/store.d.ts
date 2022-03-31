interface State {
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    allowedVars: string[];
}

interface UpdateSites {
    type: 'updateSites';
    sites: Sites;
}

interface UpdateSelectedSite {
    type: 'updateSelectedSite';
    site?: SiteProps;
}

interface UpdateAllowedVars {
    type: 'updateAllowedVars';
    vars: string[];
}

type Action = UpdateSites | UpdateSelectedSite | UpdateAllowedVars;

interface StoreContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}
