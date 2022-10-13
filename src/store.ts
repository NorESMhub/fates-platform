import React, { Dispatch, ReducerAction, ReducerState } from 'react';
import maplibre from 'maplibre-gl';

import { getSitesBounds } from './utils/sites';

export const initialState: State = {
    isLoading: false,
    ctsmInfo: undefined,
    sites: undefined,
    sitesBounds: new maplibre.LngLatBounds([-180, -90], [180, 90]),
    selectedSite: undefined,
    cases: [],
    variablesConfig: []
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
        case 'updateLoadingState':
            return {
                ...state,
                isLoading: action.isLoading
            };
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
        case 'updateCases': {
            return {
                ...state,
                cases: action.cases
            };
        }
        case 'updateCase': {
            const cases = state.cases;
            if (cases) {
                const editedCaseIdx = cases.findIndex((c) => c.id === action.case.id);
                if (editedCaseIdx !== -1) {
                    return {
                        ...state,
                        cases: cases
                            .slice(0, editedCaseIdx)
                            .concat(action.case)
                            .concat(cases.slice(editedCaseIdx + 1))
                    };
                }
                return {
                    ...state,
                    cases: [...cases, action.case]
                };
            }

            // This should never happen
            console.error('No cases found');

            return {
                ...state,
                cases
            };
        }
        case 'deleteCase': {
            const cases = state.cases;
            if (cases) {
                const editedCaseIdx = cases.findIndex((c) => c.id === action.case.id);
                if (editedCaseIdx !== -1) {
                    return {
                        ...state,
                        cases: cases.slice(0, editedCaseIdx).concat(cases.slice(editedCaseIdx + 1))
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
    }
    throw Error(`Received invalid action: ${action}`);
};
