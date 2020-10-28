export const useDocument = (state) => {
  const tracks = state.tracks.allIds.map((id) => state.tracks.byId[id]);
  const measures = state.measures.allIds.map((id) => state.measures.byId[id]);
  const durations = state.durations.allIds.map(
    (id) => state.durations.byId[id]
  );
  const notes = state.notes.allIds.map((id) => state.notes.byId[id]);

  const {
    selectedTrackNumber,
    selectedMeasureNumber,
    selectedDurationId,
    selectedStringNumber,
  } = state;
  const selectedTrack = tracks[selectedTrackNumber];
  const selectedMeasure = measures.find(
    (measure) =>
      measure.id === tracks[selectedTrackNumber].measures[selectedMeasureNumber]
  );
  const selectedDuration = state.durations.byId[selectedDurationId];

  const currentBarMaximumDuration =
    (selectedMeasure?.timeSignature.beatUnit / 4) *
    selectedMeasure?.timeSignature.beatsPerMeasure;
  const currentBarDuration =
    selectedMeasure?.durations.reduce((totalDuration, durationId) => {
      let durationInMeasure = durations.find(
        (duration) => duration.id === durationId
      );

      if (durationInMeasure?.notes.length || durationInMeasure?.isRest) {
        return (
          totalDuration +
          (durationInMeasure.isDotted
            ? durationInMeasure.length * 1.5
            : durationInMeasure.length)
        );
      }

      return totalDuration;
    }, 0) * currentBarMaximumDuration;

  return {
    tracks,
    measures,
    durations,
    notes,
    selectedTrackNumber,
    selectedTrack,
    selectedMeasureNumber,
    selectedMeasure,
    selectedDurationId,
    selectedDuration,
    selectedStringNumber,
    currentBarDuration,
    currentBarMaximumDuration,
  };
};
