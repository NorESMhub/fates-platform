import React, { Dispatch, ReducerAction, ReducerState } from 'react';
import maplibre from 'maplibre-gl';

import { getSitesBounds } from './utils/sites';

export const initialState: State = {
    ctsmInfo: undefined,
    sites: undefined,
    sitesBounds: new maplibre.LngLatBounds([-180, -90], [180, 90]),
    selectedSite: undefined,
    selectedSiteCases: undefined,
    variablesConfig: [],
    isEditingCase: false
};

export const StoreContext = React.createContext<
    [ReducerState<typeof reducers>, Dispatch<ReducerAction<typeof reducers>>]
>([
    initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {}
]);

export const reducers = (state: State, action: Action): State => {
    switch (action.type) {
        case 'updateCTSMInfo':
            return {
                ...state,
                ctsmInfo: action.info
            };
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
        case 'updateSelectedSiteCase': {
            const cases = state.selectedSiteCases;
            if (cases) {
                const editedCaseIdx = cases.findIndex((c) => c.id === action.case.id);
                if (editedCaseIdx !== -1) {
                    return {
                        ...state,
                        selectedSiteCases: cases
                            .slice(0, editedCaseIdx)
                            .concat(action.case)
                            .concat(cases.slice(editedCaseIdx + 1))
                    };
                }
                return {
                    ...state,
                    selectedSiteCases: [...cases, action.case]
                };
            }

            // This should never happen
            console.error('No cases found');

            return {
                ...state,
                selectedSiteCases: cases
            };
        }
        case 'deleteSelectedSiteCase': {
            const cases = state.selectedSiteCases;
            if (cases) {
                const editedCaseIdx = cases.findIndex((c) => c.id === action.case.id);
                if (editedCaseIdx !== -1) {
                    return {
                        ...state,
                        selectedSiteCases: cases.slice(0, editedCaseIdx).concat(cases.slice(editedCaseIdx + 1))
                    };
                }
            }
            return state;
        }
        case 'updateVariablesConfig': {
            return {
                ...state,
                variablesConfig: action.vars
            };
        }
        case 'updateCaseEditStatus': {
            return {
                ...state,
                isEditingCase: action.isEditingCase
            };
        }
    }
    throw Error(`Received invalid action: ${action}`);
};
