import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selectedTrackIndex: 0,
  selectedMeasureNumber: 1
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectTrack: (state, { payload }) => {
      state.selectedTrackIndex = payload;
    },
    selectMeasure: (state, { payload }) => {
      state.selectedMeasureNumber = payload;
    }
  }
});

export const { selectTrack, selectMeasure } = uiSlice.actions;
export const selectedTrackIndexSelector = state => state.ui.selectedTrackIndex;

export default uiSlice.reducer;
