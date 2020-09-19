import * as actionTypes from './actionTypes';

export const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_EDITION_PALETTE:
      return {
        ...state,
        isEditionPaletteShown: !state.isEditionPaletteShown,
      };
    case actionTypes.TOGGLE_GLOBAL_VIEW:
      return {
        ...state,
        isGlobalViewShown: !state.isGlobalViewShown,
      };
    case actionTypes.TOGGLE_INSPECTOR:
      return {
        ...state,
        isInspectorShown: !state.isInspectorShown,
      };
    default:
      return state;
  }
};
