import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  tracks: {
    byId: {},
    allIds: []
  },
  measures: {
    byId: {},
    allIds: []
  }
  // notes: []
};

export const defaultMeasureOptions = {
  timeSignature: {
    beatsPerMeasure: 4,
    beatUnit: 4
  },
  keySignature: {
    tonic: 'C',
    isMajor: true
  },
  notes: []
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  // https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
  reducers: {
    resetDocument: state => {
      state.tracks = initialState.tracks;
      state.measures = initialState.measures;
    },
    addTrack: (state, { payload }) => {
      state.tracks.byId[payload.id] = { ...payload };
      state.tracks.allIds.push(payload.id);
    },
    deleteTrack: (state, { payload }) => {
      // Delete this track's measures
      for (const id of state.tracks.byId[payload].measures) {
        delete state.measures.byId[id];
        state.measures.allIds.splice(
          state.measures.allIds.findIndex(measureId => measureId === id),
          1
        );
      }

      // Delete the track itself
      delete state.tracks.byId[payload];
      state.tracks.allIds.splice(
        state.tracks.allIds.findIndex(trackId => trackId === payload),
        1
      );
    },
    // TODO Add measure for all tracks
    addMeasure: (state, { payload }) => {
      let { trackId, ...payloadWithoutTrackId } = payload;
      let newMeasureId = payload.id;

      state.tracks.byId[trackId].measures.push(newMeasureId);
      state.measures.byId[newMeasureId] = { ...payloadWithoutTrackId };
      state.measures.allIds.push(newMeasureId);
    },
    // TODO Delete measure at this measure number for all tracks
    deleteMeasure: (state, { payload }) => {
      let { trackId } = payload;
      let measureId = payload.id;

      state.tracks.byId[trackId].measures.splice(
        state.tracks.byId[trackId].measures.findIndex(
          measure => measure.id === measureId
        ),
        1
      );
      delete state.measures.byId[measureId];
      state.measures.allIds.splice(
        state.measures.allIds.findIndex(id => id === measureId),
        1
      );
    }
    // addNote: (state, { measureId, newNoteId, ...payload }) => {
    //   state.measures.byId[measureId].notes.push(newNoteId);
    //   state.notes.byId[newNoteId] = { id: newNoteId, ...payload };
    //   state.notes.allIds.push(newNoteId);
    // }
  }
});

export const {
  addTrack,
  addMeasure,
  deleteTrack,
  deleteMeasure
} = documentSlice.actions;
export const tracksSelector = state =>
  state.document.tracks.allIds.map(
    trackId => state.document.tracks.byId[trackId]
  );
export const measuresSelector = state =>
  state.document.measures.allIds.map(
    measureId => state.document.measures.byId[measureId]
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
