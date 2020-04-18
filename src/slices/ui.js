import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selectedTrackNumber: 0,
  selectedMeasureNumber: 0
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    resetUi: state => {
      state.selectedTrackNumber = initialState.selectedTrackNumber;
      state.selectedMeasureNumber = initialState.selectedMeasureNumber;
    },
    selectTrack: (state, { payload }) => {
      state.selectedTrackNumber = payload;
    },
    selectMeasure: (state, { payload }) => {
      state.selectedMeasureNumber = payload;
    }
  }
});

export const { selectTrack, selectMeasure } = uiSlice.actions;
export const selectedTrackNumberSelector = state =>
  state.ui.selectedTrackNumber;
export const selectedMeasureNumberSelector = state =>
  state.ui.selectedMeasureNumber;

export default uiSlice.reducer;
