import * as actionTypes from './actionTypes';

export const initialAppState = {
  isEditionPaletteShown: true,
  isGlobalViewShown: true,
  isInspectorShown: true,
  selectedTrackNumber: 0,
  selectedMeasureNumber: 0,
  selectedDurationId: undefined,
  selectedStringNumber: 0,
  // https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
  tracks: {
    byId: {},
    allIds: [],
  },
  measures: {
    byId: {},
    allIds: [],
  },
  durations: {
    byId: {},
    allIds: [],
  },
  notes: {
    byId: {},
    allIds: [],
  },
};

export const defaultMeasureOptions = {
  timeSignature: {
    beatsPerMeasure: 4,
    beatUnit: 4,
  },
  keySignature: {
    tonic: 'C',
    isMajor: true,
  },
  durations: [],
};

export const defaultDurationOptions = {
  isRest: false,
  length: 1 / 4,
  isDotted: false,
  notes: [],
};

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
    case actionTypes.ADD_TRACK:
      const { type, durationIds, durationLength, ...newTrack } = action;

      const measureIds = newTrack.measures;
      const isFirstTrack = state.tracks.allIds.length === 0;

      return {
        ...state,
        tracks: {
          byId: { ...state.tracks.byId, [newTrack.id]: { ...newTrack } },
          allIds: [...state.tracks.allIds, newTrack.id],
        },
        measures: {
          byId: {
            ...state.measures.byId,
            ...measureIds.reduce(
              (measureIdMap, measureId, measureNumber) => ({
                ...measureIdMap,
                [measureId]: isFirstTrack
                  ? {
                      // Add one new measure with default options
                      ...defaultMeasureOptions,
                      id: measureId,
                      durations: [durationIds[measureNumber]],
                    }
                  : {
                      // Copy each existing measure's time signature and key signature
                      ...state.measures.byId[
                        state.tracks.byId[state.tracks.allIds[0]].measures[
                          measureNumber
                        ]
                      ],
                      id: measureId,
                      durations: [durationIds[measureNumber]],
                    },
              }),
              {}
            ),
          },
          allIds: [...state.measures.allIds, ...measureIds],
        },
        durations: {
          byId: {
            ...state.durations.byId,
            ...durationIds.reduce(
              // Add a new duration with default options to each new measure
              (durationIdMap, durationId) => ({
                ...durationIdMap,
                [durationId]: {
                  ...defaultDurationOptions,
                  id: durationId,
                  length: durationLength || defaultDurationOptions.length,
                },
              }),
              {}
            ),
          },
          allIds: [...state.durations.allIds, ...durationIds],
        },
      };
    // TODO DELETE_TRACK
    // TODO ADD_MEASURE
    // TODO DELETE_MEASURE
    // TODO ADD_DURATION
    // TODO ADD_REST
    // TODO SET_DURATION_DOTTED
    // TODO ADD_NOTE
    // TODO DELETE_NOTE
    // TODO DELETE_DURATION
    // TODO MARK_DURATION_AS_NOT_REST
    // TODO SET_DURATION_LENGTH
    default:
      return state;
  }
};
