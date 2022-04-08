import React from 'react';
import maplibre from 'maplibre-gl';

import { getSitesBounds } from './utils/sites';

export const initialState: State = {
    sites: undefined,
    sitesBounds: new maplibre.LngLatBounds([-180, -90], [180, 90]),
    selectedSite: undefined,
    selectedSiteCases: undefined,
    variablesConfig: [],
    popover: {}
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const StateContext = React.createContext<StoreContext>({ state: initialState, dispatch: () => {} });

export const reducers = (state: State, action: Action): State => {
    switch (action.type) {
        case 'updateSites':
            return {
                ...state,
                sites: action.sites,
                sitesBounds: getSitesBounds(action.sites)
            };
        case 'updateSelectedSite': {
            return {
                ...state,
                selectedSite: action.site
            };
        }
        case 'updateSelectedSiteCases': {
            return {
                ...state,
                selectedSiteCases: action.cases
            };
        }
        case 'updateVariablesConfig': {
            return {
                ...state,
                variablesConfig: action.vars
            };
        }
        case 'updatePopover': {
            return {
                ...state,
                popover: action.popover
            };
        }
    }
    throw Error(`Received invalid action: ${action}`);
};
