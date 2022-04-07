interface State {
    sites?: Sites;
    sitesBounds: maplibregl.LngLatBoundsLike;
    selectedSite?: SiteProps;
    selectedSiteCases?: CaseWithTaskInfo[];
    allowedVars: CaseAllowedVariable[];
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

interface UpdateAllowedVars {
    type: 'updateAllowedVars';
    vars: CaseAllowedVariable[];
}

interface UpdatePopover {
    type: 'updatePopover';
    popover: PopoverProps;
}

type Action = UpdateSites | UpdateSelectedSite | UpdateSelectedSiteCases | UpdateAllowedVars | UpdatePopover;

interface StoreContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}
