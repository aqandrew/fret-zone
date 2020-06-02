import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
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

const defaultDurationOptions = {
  isRest: false,
  length: 1 / 4,
  notes: [],
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  // https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
  reducers: {
    resetDocument: (state) => {
      state.tracks = initialState.tracks;
      state.measures = initialState.measures;
    },
    addTrack: (state, { payload }) => {
      let { durationIds, ...restOfPayload } = payload;
      let measureIds = restOfPayload.measures;
      let newTrackId = restOfPayload.id;
      let isFirstTrack = state.tracks.allIds.length === 0;

      state.tracks.byId[newTrackId] = { ...restOfPayload };
      state.tracks.allIds.push(newTrackId);

      measureIds.forEach((newMeasureId, measureNumber) => {
        let measureToAdd;
        let newDurationId = durationIds[measureNumber];

        // Add one measure with default options
        if (isFirstTrack) {
          measureToAdd = {
            id: newMeasureId,
            ...defaultMeasureOptions,
            durations: [newDurationId],
          };
          // Otherwise, add as many new measures to this track as the number of existing measures in each other track
        } else {
          const existingMeasure =
            state.measures.byId[
              state.tracks.byId[state.tracks.allIds[0]].measures[measureNumber]
            ];

          measureToAdd = {
            ...existingMeasure,
            id: newMeasureId,
            durations: [newDurationId],
          };
        }

        state.measures.byId[newMeasureId] = measureToAdd;
        state.measures.allIds.push(newMeasureId);

        // Add a new duration to each measure
        // TODO Added duration should have the same length as the last selected duration
        state.durations.byId[newDurationId] = {
          id: newDurationId,
          ...defaultDurationOptions,
        };
        state.durations.allIds.push(newDurationId);
      });
    },
    deleteTrack: (state, { payload }) => {
      // Delete this track's measures
      for (const id of state.tracks.byId[payload].measures) {
        delete state.measures.byId[id];
        state.measures.allIds.splice(
          state.measures.allIds.findIndex((measureId) => measureId === id),
          1
        );
      }

      // Delete the track itself
      delete state.tracks.byId[payload];
      state.tracks.allIds.splice(
        state.tracks.allIds.findIndex((trackId) => trackId === payload),
        1
      );
    },
    // TODO Refactor this to be used for inserting a new measure
    addMeasure: (state, { payload }) => {
      let { trackMeasureIds, ...restOfPayload } = payload;

      // Add a new measure for each track
      for (const trackId in trackMeasureIds) {
        let newMeasureId = trackMeasureIds[trackId].measureId;
        let newDurationId = trackMeasureIds[trackId].durationId;

        state.tracks.byId[trackId].measures.push(newMeasureId);
        state.measures.byId[newMeasureId] = {
          id: newMeasureId,
          ...restOfPayload,
          durations: [newDurationId],
        };
        state.measures.allIds.push(newMeasureId);

        // Add a new duration for each measure
        // TODO Added duration should have the same length as the last selected duration
        state.durations.byId[newDurationId] = {
          id: newDurationId,
          ...defaultDurationOptions,
        };
        state.durations.allIds.push(newDurationId);
      }
    },
    deleteMeasure: (state, { payload }) => {
      for (const trackId of state.tracks.allIds) {
        let measureId = state.tracks.byId[trackId].measures[payload];

        state.tracks.byId[trackId].measures.splice(payload, 1);
        delete state.measures.byId[measureId];
        state.measures.allIds.splice(
          state.measures.allIds.findIndex((id) => id === measureId),
          1
        );
      }
    },
    addDuration: (state, { payload }) => {
      let { measureId, newDurationId } = payload;

      state.measures.byId[measureId].durations.push(newDurationId);
      // TODO Added duration should have the same length as the last selected duration
      state.durations.byId[newDurationId] = {
        id: newDurationId,
        ...defaultDurationOptions,
      };
      state.durations.allIds.push(newDurationId);
    },
    addRest: (state, { payload }) => {
      const thisDuration = state.durations.byId[payload];
      thisDuration.isRest = true;

      // If this duration has notes,
      if (thisDuration.notes.length) {
        // Delete all of the duration's notes
        thisDuration.notes.forEach((noteId) => {
          delete state.notes.byId[noteId];
          state.notes.allIds.splice(
            state.notes.allIds.findIndex((id) => id === noteId),
            1
          );
        });

        thisDuration.notes.splice(0, thisDuration.notes.length);
      }
    },
    // TODO Refactor this to be used for inserting a new note
    addNote: (state, { payload }) => {
      let { durationId, ...note } = payload;

      // If this duration already has a note at the specified string,
      if (
        state.durations.byId[durationId].notes
          .map((noteId) => state.notes.byId[noteId])
          .map((note) => note.string)
          .includes(payload.string)
      ) {
        // Delete the existing note
        state.durations.byId[durationId].notes.splice(
          state.durations.byId[durationId].notes.findIndex(
            (noteId) => state.notes.byId[noteId].string === payload.string
          ),
          1
        );
      }

      state.durations.byId[durationId].isRest = false;
      state.durations.byId[durationId].notes.push(note.id);
      state.notes.byId[note.id] = note;
      state.notes.allIds.push(note.id);
    },
    deleteNote: (state, { payload }) => {
      const durationId = state.durations.allIds.find((id) =>
        state.durations.byId[id].notes.includes(payload)
      );

      state.durations.byId[durationId].notes.splice(
        state.durations.byId[durationId].notes.findIndex(
          (noteId) => noteId === payload
        ),
        1
      );
      delete state.notes.byId[payload];
      state.notes.allIds.splice(
        state.notes.allIds.findIndex((id) => id === payload),
        1
      );
    },
    deleteDuration: (state, { payload }) => {
      const measureId = state.measures.allIds.find((id) =>
        state.measures.byId[id].durations.includes(payload)
      );

      state.measures.byId[measureId].durations.splice(
        state.measures.byId[measureId].durations.findIndex(
          (durationId) => durationId === payload
        ),
        1
      );
      delete state.durations.byId[payload];
      state.durations.allIds.splice(
        state.durations.allIds.findIndex((id) => id === payload),
        1
      );
    },
    shortenDuration: (state, { payload }) => {
      state.durations.byId[payload].length =
        state.durations.byId[payload].length / 2;
    },
    lengthenDuration: (state, { payload }) => {
      state.durations.byId[payload].length =
        state.durations.byId[payload].length * 2;
    },
  },
});

export const {
  addTrack,
  addMeasure,
  addDuration,
  addNote,
  addRest,
  deleteTrack,
  deleteMeasure,
  deleteDuration,
  deleteNote,
  shortenDuration,
  lengthenDuration,
} = documentSlice.actions;
export const tracksSelector = (state) =>
  state.document.tracks.allIds.map(
    (trackId) => state.document.tracks.byId[trackId]
  );
export const measuresSelector = (state) =>
  state.document.measures.allIds.map(
    (measureId) => state.document.measures.byId[measureId]
  );
export const durationsSelector = (state) =>
  state.document.durations.allIds.map(
    (durationId) => state.document.durations.byId[durationId]
  );
export const notesSelector = (state) =>
  state.document.notes.allIds.map(
    (noteId) => state.document.notes.byId[noteId]
  );
// export const measuresInTrackSelector = (state, trackId) =>
//   state.document.tracks.byId[trackId].measures.map(
//     measureId => state.document.measures.byId[measureId]
//   );
// export const notesInMeasureSelector = (state, measureId) =>
//   state.document.measures.byId[measureId].notes.map(
//     noteId => state.document.notes.byId[noteId]
//   );
export default documentSlice.reducer;
