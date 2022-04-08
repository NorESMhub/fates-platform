interface State {
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
    variablesConfig: CaseVariableConfig[];
    popover: PopoverProps;
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

interface UpdatePopover {
    type: 'updatePopover';
    popover: PopoverProps;
}

type Action = UpdateSites | UpdateSelectedSite | UpdateSelectedSiteCases | UpdateVariablesConfig | UpdatePopover;

interface StoreContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}
