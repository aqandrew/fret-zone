import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  tracks: []
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addTrack: (state, { payload }) => {
      state.tracks.push(payload);
    }
    // TODO Define deleteTrack and dispatch it within AppMenu via button, or GlobalView via right-click
  }
});

export const { addTrack } = documentSlice.actions;
export const tracksSelector = state => state.document.tracks;
export default documentSlice.reducer;
