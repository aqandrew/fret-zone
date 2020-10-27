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
    case actionTypes.ADD_TRACK: {
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
    }
    case actionTypes.DELETE_TRACK: {
      const { trackId } = action;
      const { [trackId]: deletedTrack, ...remainingTracks } = state.tracks.byId;
      const deletedMeasureIds = deletedTrack.measures;
      const deletedDurationIds = deletedMeasureIds
        .map((id) => state.measures.byId[id].durations)
        .flat();
      const deletedNoteIds = deletedDurationIds
        .map((id) => state.durations.byId[id].notes)
        .flat();

      return {
        ...state,
        tracks: {
          byId: remainingTracks,
          allIds: state.tracks.allIds.filter((id) => id !== trackId),
        },
        measures: getRemainingMeasures(state, deletedMeasureIds),
        durations: getRemainingDurations(state, deletedDurationIds),
        notes: getRemainingNotes(state, deletedNoteIds),
      };
    }
    case actionTypes.ADD_MEASURE: {
      // TODO Refactor this to be used for inserting a new measure
      const { trackMeasureIds, durationLength } = action;

      return {
        ...state,
        // Add new measure IDs to each track
        tracks: {
          ...state.tracks,
          byId: state.tracks.allIds.reduce((tracks, trackId) => {
            const track = state.tracks.byId[trackId];

            return {
              ...tracks,
              [trackId]: {
                ...track,
                measures: [
                  ...track.measures,
                  trackMeasureIds[trackId].measureId,
                ],
              },
            };
          }, state.tracks.byId),
        },
        // Add a new measure to each track
        measures: {
          byId: Object.values(trackMeasureIds).reduce(
            (measures, idMapping) => ({
              ...measures,
              [idMapping.measureId]: {
                ...defaultMeasureOptions,
                id: idMapping.measureId,
                durations: [idMapping.durationId],
              },
            }),
            state.measures.byId
          ),
          allIds: [
            ...state.measures.allIds,
            ...Object.values(trackMeasureIds).map(
              (idMapping) => idMapping.measureId
            ),
          ],
        },
        // Add a new duration for each measure added
        durations: {
          byId: Object.values(trackMeasureIds).reduce(
            (durations, idMapping) => ({
              ...durations,
              [idMapping.durationId]: {
                ...defaultDurationOptions,
                id: idMapping.durationId,
                length: durationLength,
              },
            }),
            state.durations.byId
          ),
          allIds: [
            ...state.durations.allIds,
            ...Object.values(trackMeasureIds).map(
              (idMapping) => idMapping.durationId
            ),
          ],
        },
      };
    }
    case actionTypes.DELETE_MEASURE: {
      // TODO We already know that measureNumber === state.selectedMeasureNumber
      const { measureNumber } = action;
      const deletedMeasureIds = state.tracks.allIds.map(
        (id) => state.tracks.byId[id].measures[measureNumber]
      );
      const deletedDurationIds = deletedMeasureIds
        .map((id) => state.measures.byId[id].durations)
        .flat();
      const deletedNoteIds = deletedDurationIds
        .map((id) => state.durations.byId[id].notes)
        .flat();

      return {
        ...state,
        // Remove (measureNumber)th measure IDs from tracks
        tracks: {
          ...state.tracks,
          byId: state.tracks.allIds.reduce((tracks, id) => {
            const track = tracks[id];

            return {
              ...tracks,
              [id]: {
                ...track,
                measures: track.measures.filter(
                  (measureId, i) => i !== measureNumber
                ),
              },
            };
          }, state.tracks.byId),
        },
        measures: getRemainingMeasures(state, deletedMeasureIds),
        durations: getRemainingDurations(state, deletedDurationIds),
        notes: getRemainingNotes(state, deletedNoteIds),
      };
    }
    case actionTypes.ADD_DURATION: {
      const { measureId, newDurationId, length, isDotted } = action;
      const measure = state.measures.byId[measureId];

      return {
        ...state,
        measures: {
          ...state.measures,
          byId: {
            ...state.measures.byId,
            [measureId]: {
              ...measure,
              durations: [...measure.durations, newDurationId],
            },
          },
        },
        durations: {
          byId: {
            ...state.durations.byId,
            [newDurationId]: {
              ...defaultDurationOptions,
              length,
              isDotted,
            },
          },
          allIds: [...state.durations.allIds, newDurationId],
        },
      };
    }
    case actionTypes.ADD_REST: {
      // TODO We already know that durationId === state.selectedDurationId
      const { durationId } = action;
      const duration = state.durations.byId[durationId];

      return {
        ...state,
        durations: {
          ...state.durations,
          byId: {
            ...state.durations.byId,
            [durationId]: { ...duration, isRest: true },
          },
        },
        // If this duration has notes, delete all of the duration's notes
        notes: duration.notes.length
          ? getRemainingNotes(duration.notes)
          : state.notes,
      };
    }
    case actionTypes.SET_DURATION_DOTTED: {
      // TODO We already know that durationId === state.selectedDurationId
      const { durationId, isDotted } = action;

      return {
        ...state,
        durations: {
          ...state.durations,
          byId: {
            ...state.durations.byId,
            [durationId]: { ...state.durations.byId[durationId], isDotted },
          },
        },
      };
    }
    case actionTypes.ADD_NOTE: {
      const { durationId, type, ...note } = action;
      const duration = state.durations.byId[durationId];

      return {
        ...state,
        durations: {
          ...state.durations,
          byId: {
            ...state.durations.byId,
            [durationId]: {
              ...duration,
              notes: [...duration.notes, note.id],
            },
          },
        },
        notes: {
          byId: {
            ...state.notes.byId,
            [note.id]: note,
          },
          allIds: [...state.notes.allIds, note.id],
        },
      };
    }
    case actionTypes.DELETE_NOTE: {
      // TODO We already know that noteId === selectedNoteId
      const { noteId } = action;
      const durationId = state.durations.allIds.find((id) =>
        state.durations.byId[id].notes.includes(noteId)
      );
      const duration = state.durations.byId[durationId];

      return {
        ...state,
        durations: {
          ...state.durations,
          byId: {
            ...state.durations.byId,
            [durationId]: {
              ...duration,
              notes: duration.notes.filter((id) => id !== noteId),
            },
          },
        },
        notes: getRemainingNotes(state, [noteId]),
      };
    }
    // TODO DELETE_DURATION
    // TODO MARK_DURATION_AS_NOT_REST
    // TODO SET_DURATION_LENGTH
    default:
      return state;
  }
};

const getRemainingMeasures = (state, deletedMeasureIds) => ({
  byId: deletedMeasureIds.reduce((measureIdMap, id) => {
    const { [id]: deletedMeasure, ...remainingMeasures } = measureIdMap;

    return remainingMeasures;
  }, state.measures.byId),
  allIds: state.measures.allIds.filter((id) => !deletedMeasureIds.includes(id)),
});

const getRemainingDurations = (state, deletedDurationIds) => ({
  byId: deletedDurationIds.reduce((durationIdMap, id) => {
    const { [id]: deletedDuration, ...remainingDurations } = durationIdMap;

    return remainingDurations;
  }, state.durations.byId),
  allIds: state.durations.allIds.filter(
    (id) => !deletedDurationIds.includes(id)
  ),
});

const getRemainingNotes = (state, deletedNoteIds) => ({
  byId: deletedNoteIds.reduce((noteIdMap, id) => {
    const { [id]: deletedNote, ...remainingNotes } = noteIdMap;

    return remainingNotes;
  }, state.notes.byId),
  allIds: state.notes.allIds.filter((id) => !deletedNoteIds.includes(id)),
});
