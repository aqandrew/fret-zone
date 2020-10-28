export const useDocument = (state) => {
  const tracks = state.tracks.allIds.map((id) => state.tracks.byId[id]);
  const measures = state.measures.allIds.map((id) => state.measures.byId[id]);
  const durations = state.durations.allIds.map(
    (id) => state.durations.byId[id]
  );
  const notes = state.notes.allIds.map((id) => state.notes.byId[id]);
  // TODO Would it be good to put selected track/measure/duration/note here?

  return { tracks, measures, durations, notes };
};
