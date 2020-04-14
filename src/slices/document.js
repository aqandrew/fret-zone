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
    // TODO This crashes the app when using Redux Dev Tools' dispatch console
    // resetDocument: state => {
    //   // state = initialState;
    //   state.tracks = initialState.tracks;
    //   state.measures = initialState.measures;
    // },
    addTrack: (state, { payload }) => {
      state.tracks.byId[payload.id] = { ...payload };
      state.tracks.allIds.push(payload.id);
    },
    // deleteTrack: (state, { payload }) => {},
    addMeasure: (state, { payload }) => {
      let { trackId, ...payloadWithoutTrackId } = payload;
      let newMeasureId = payload.id;

      state.tracks.byId[trackId].measures.push(newMeasureId);
      state.measures.byId[newMeasureId] = { ...payloadWithoutTrackId };
      state.measures.allIds.push(newMeasureId);
    }
    // TODO Define deleteMeasure so that state can be cleared in Redux DevTools
    // addNote: (state, { measureId, newNoteId, ...payload }) => {
    //   state.measures.byId[measureId].notes.push(newNoteId);
    //   state.notes.byId[newNoteId] = { id: newNoteId, ...payload };
    //   state.notes.allIds.push(newNoteId);
    // }
  }
});

export const { addTrack, addMeasure } = documentSlice.actions;
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
