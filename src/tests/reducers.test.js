import {
  appReducer,
  initialAppState,
  defaultTrackOptions,
  defaultMeasureOptions,
  defaultDurationOptions,
} from '../reducers';
import * as actionTypes from '../actionTypes';

describe('reducers', () => {
  it('adds a track', () => {
    const documentWithOneTrack = appReducer(initialAppState, {
      ...defaultTrackOptions,
      type: actionTypes.ADD_TRACK,
      id: 'foo',
      measures: ['bar'],
      durationIds: ['baz'],
    });

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
