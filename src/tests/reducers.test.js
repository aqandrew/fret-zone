import {
  documentSlice,
  initialState as initialDocumentState,
  defaultTrackOptions,
  defaultMeasureOptions,
  defaultDurationOptions,
} from '../slices/document';
import { initialState as initialUiState } from '../slices/ui';
import rootReducer from '../slices';

describe('reducers', () => {
  it('initializes document state correctly', () => {
    expect(rootReducer(undefined, {}).document).toEqual(initialDocumentState);
  });

  it('initializes UI state correctly', () => {
    expect(rootReducer(undefined, {}).ui).toEqual(initialUiState);
  });

  it('adds a track', () => {
    const documentWithOneTrack = documentSlice.reducer(
      initialDocumentState,
      documentSlice.actions.addTrack({
        id: 'foo',
        measures: ['bar'],
        durationIds: ['baz'],
        durationLength: defaultDurationOptions.length,
        ...defaultTrackOptions,
      })
    );

    expect(documentWithOneTrack.tracks.allIds.length).toBe(1);
    expect(documentWithOneTrack.tracks.allIds[0]).toBe('foo');
    expect(documentWithOneTrack.tracks.byId['foo']).toStrictEqual({
      ...defaultTrackOptions,
      id: 'foo',
      measures: ['bar'],
    });
    expect(documentWithOneTrack.measures.allIds.length).toBe(1);
    expect(documentWithOneTrack.measures.allIds[0]).toBe('bar');
    expect(documentWithOneTrack.measures.byId['bar']).toStrictEqual({
      ...defaultMeasureOptions,
      id: 'bar',
      durations: ['baz'],
    });
    expect(documentWithOneTrack.durations.allIds.length).toBe(1);
    expect(documentWithOneTrack.durations.allIds[0]).toBe('baz');
    expect(documentWithOneTrack.durations.byId['baz']).toStrictEqual({
      ...defaultDurationOptions,
      id: 'baz',
    });
  });
});
