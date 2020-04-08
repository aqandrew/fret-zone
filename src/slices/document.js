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
    // TODO Define deleteTrack and dispatch it within GlobalView
  }
});

export const { addTrack } = documentSlice.actions;
export const tracksSelector = state => state.tracks;
export default documentSlice.reducer;
