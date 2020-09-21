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
    case actionTypes.SELECT_TRACK:
      return {
        ...state,
        selectedTrackNumber: action.trackNumber,
      };
    case actionTypes.SELECT_MEASURE:
      return {
        ...state,
        selectedMeasureNumber: action.measureNumber,
      };
    case actionTypes.SELECT_DURATION:
      return {
        ...state,
        selectedDurationId: action.durationId,
      };
    case actionTypes.SELECT_STRING:
      return {
        ...state,
        selectedStringNumber: action.stringNumber,
      };
    default:
      return state;
  }
};
