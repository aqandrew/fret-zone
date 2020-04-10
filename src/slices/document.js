import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  tracks: {
    byId: {},
    allIds: []
  }
  // measures: [],
  // notes: []
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addTrack: (state, { newTrackId, payload }) => {
      state.tracks.byId[newTrackId] = { id: newTrackId, ...payload };
      state.tracks.allIds.push(newTrackId);
    }
    // TODO Define deleteTrack and dispatch it within AppMenu via button, or GlobalView via right-click
    // addMeasure: (state, { trackId, newMeasureId, ...payload }) => {
    //   state.tracks.byId[trackId].measures.push(newMeasureId);
    //   state.measures.byId[newMeasureId] = { id: newMeasureId, ...payload };
    //   state.measures.allIds.push(newMeasureId);
    // },
    // addNote: (state, { measureId, newNoteId, ...payload }) => {
    //   state.measures.byId[measureId].notes.push(newNoteId);
    //   state.notes.byId[newNoteId] = { id: newNoteId, ...payload };
    //   state.notes.allIds.push(newNoteId);
    // }
  }
});

export const { addTrack } = documentSlice.actions;
export const tracksSelector = state =>
  state.document.tracks.allIds.map(
    trackId => state.document.tracks.byId[trackId]
  );
// https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
// export const measuresInTrackSelector = (state, trackId) =>
//   state.document.tracks.byId[trackId].measures.map(
//     measureId => state.document.measures.byId[measureId]
//   );
// export const notesInMeasureSelector = (state, measureId) =>
//   state.document.measures.byId[measureId].notes.map(
//     noteId => state.document.notes.byId[noteId]
//   );
export default documentSlice.reducer;
