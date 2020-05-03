import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selectedTrackNumber: 0,
  selectedMeasureNumber: 0,
  selectedStringNumber: 0,
  selectedDurationNumber: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    resetUi: (state) => {
      state.selectedTrackNumber = initialState.selectedTrackNumber;
      state.selectedMeasureNumber = initialState.selectedMeasureNumber;
    },
    selectTrack: (state, { payload }) => {
      state.selectedTrackNumber = payload;
    },
    selectMeasure: (state, { payload }) => {
      state.selectedMeasureNumber = payload;
    },
    selectString: (state, { payload }) => {
      state.selectedStringNumber = payload;
    },
    selectDuration: (state, { payload }) => {
      state.selectedDurationNumber = payload;
    },
  },
});

export const {
  selectTrack,
  selectMeasure,
  selectString,
  selectDuration,
} = uiSlice.actions;
export const selectedTrackNumberSelector = (state) =>
  state.ui.selectedTrackNumber;
export const selectedMeasureNumberSelector = (state) =>
  state.ui.selectedMeasureNumber;
export const selectedStringNumberSelector = (state) =>
  state.ui.selectedStringNumber;
export const selectedDurationNumberSelector = (state) =>
  state.ui.selectedDurationNumber;

export default uiSlice.reducer;
