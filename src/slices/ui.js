import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selectedTrackNumber: 0,
  selectedMeasureNumber: 0,
  selectedStringNumber: 0,
  selectedNoteNumber: 0,
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
    selectNote: (state, { payload }) => {
      state.selectedNoteNumber = payload;
    },
  },
});

export const {
  selectTrack,
  selectMeasure,
  selectString,
  selectNote,
} = uiSlice.actions;
export const selectedTrackNumberSelector = (state) =>
  state.ui.selectedTrackNumber;
export const selectedMeasureNumberSelector = (state) =>
  state.ui.selectedMeasureNumber;
export const selectedStringNumberSelector = (state) =>
  state.ui.selectedStringNumber;
export const selectedNoteNumberSelector = (state) =>
  state.ui.selectedNoteNumber;

export default uiSlice.reducer;
