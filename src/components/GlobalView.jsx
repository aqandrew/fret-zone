import React, { useContext } from 'react';

import DispatchContext from '../DispatchContext';
import AppStateContext from '../AppStateContext';
import { useDocument } from '../hooks/useDocument';
import { SELECT_TRACK, SELECT_MEASURE, SELECT_DURATION } from '../actionTypes';

import './GlobalView.scss';

const GlobalView = ({
  selectedTrackNumber,
  selectedMeasureNumber,
  selectedDurationId,
  openAddTrackModal,
}) => {
  const dispatchApp = useContext(DispatchContext);
  const appState = useContext(AppStateContext);
  const { tracks, measures } = useDocument(appState);

  const renderTrackControls = () =>
    tracks.map((track, trackNumber) => (
      <TrackControl
        track={track}
        trackNumber={trackNumber}
        selectedTrackNumber={selectedTrackNumber}
        selectedMeasureNumber={selectedMeasureNumber}
        selectedDurationId={selectedDurationId}
        key={trackNumber}
      />
    ));

  const renderMeasureTable = () =>
    tracks.map((track, TrackNumber) => (
      <MeasureTableRow
        track={track}
        trackNumber={TrackNumber}
        selectedTrackNumber={selectedTrackNumber}
        selectedMeasureNumber={selectedMeasureNumber}
        selectedDurationId={selectedDurationId}
        key={TrackNumber}
      />
    ));

  return (
    <div className="GlobalView">
      <div className="TrackControls">
        <div className="TrackControls__Header">
          <button
            className="TrackControls__Button--AddTrack"
            title="Add Track"
            onClick={openAddTrackModal}
          >
            +
          </button>
          <span className="TrackControls__Heading">Tracks</span>
        </div>
        {renderTrackControls()}
        <div className="TrackControls__Footer">
          <span className="TrackControls__Heading">Master</span>
        </div>
      </div>
      <div className="MeasureTable">
        <div className="MeasureTable__Header">
          {tracks.length
            ? tracks[selectedTrackNumber].measures.map(
                (measureId, measureNumber) => {
                  let measureNumberClassName = 'MeasureTable__MeasureNumber';

                  // TODO Refactor using classnames utility
                  if (measureNumber === selectedMeasureNumber) {
                    measureNumberClassName += ` ${measureNumberClassName}--IsSelected`;
                  }

                  return (
                    <div
                      className={measureNumberClassName}
                      onClick={() => {
                        const durationIdToSelect = measures.find(
                          (measure) => measure.id === measureId
                        ).durations[0];

                        dispatchApp({ type: SELECT_MEASURE, measureNumber });
                        dispatchApp({
                          type: SELECT_DURATION,
                          durationId: durationIdToSelect,
                        });
                      }}
                      key={measureNumber}
                    >
                      {measureNumber + 1}
                    </div>
                  );
                }
              )
            : null}
        </div>
        {renderMeasureTable()}
        <div className="MeasureTable__Footer">
          {/* TODO Show section names */}
        </div>
      </div>
    </div>
  );
};

const TrackControl = ({
  track,
  trackNumber,
  selectedTrackNumber,
  selectedMeasureNumber,
  selectedDurationId,
}) => {
  const dispatchApp = useContext(DispatchContext);

  const appState = useContext(AppStateContext);
  const { tracks, measures } = useDocument(appState);

  let trackControlClassName = 'TrackControl';

  // TODO Refactor using classnames utility
  if (trackNumber === selectedTrackNumber) {
    trackControlClassName += ` ${trackControlClassName}--IsActive`;
  }

  return (
    <div
      className={trackControlClassName}
      onClick={() => {
        // TODO Remove duplicated code between this and .LCD__Control--CurrentTrack.onChange
        // Select first duration of track's measure at selectedMeasureNumber
        const durationIdToSelect = measures.find(
          (measure) =>
            measure.id === tracks[trackNumber].measures[selectedMeasureNumber]
        ).durations[0];

        dispatchApp({ type: SELECT_TRACK, trackNumber });
        dispatchApp({ type: SELECT_DURATION, durationId: durationIdToSelect });
      }}
    >
      <div className="TrackControl__ColorTab"></div>
      <span className="TrackControl__TrackNumber">{trackNumber + 1}.</span>
      {track.fullName}
    </div>
  );
};

// TODO Remove prop drilling; MeasureTableRow doesn't need to know about the selected track/measure/duration
const MeasureTableRow = ({
  track,
  trackNumber,
  selectedTrackNumber,
  selectedMeasureNumber,
  selectedDurationId,
}) => (
  <div className="MeasureTable__Row">
    {track.measures.map((measureId, measureNumber) => (
      <MeasureTableCell
        measureId={measureId}
        measureNumber={measureNumber}
        trackNumber={trackNumber}
        selectedTrackNumber={selectedTrackNumber}
        selectedMeasureNumber={selectedMeasureNumber}
        selectedDurationId={selectedDurationId}
        key={measureId}
      />
    ))}
  </div>
);

const MeasureTableCell = ({
  measureId,
  measureNumber,
  trackNumber,
  selectedTrackNumber,
  selectedMeasureNumber,
  selectedDurationId,
}) => {
  const dispatchApp = useContext(DispatchContext);
  const appState = useContext(AppStateContext);
  const { measures, durations } = useDocument(appState);

  const getMeasure = () => measures.find((measure) => measure.id === measureId);

  const cellBaseClassName = 'MeasureTable__Cell';
  let cellClassName = cellBaseClassName;

  // TODO Refactor using classnames utility
  if (
    trackNumber === selectedTrackNumber &&
    measureNumber === selectedMeasureNumber
  ) {
    cellClassName += ` ${cellBaseClassName}--IsSelected`;
  }

  if (
    getMeasure().durations.every((durationId) => {
      const thisDuration = durations.find(
        (duration) => duration.id === durationId
      );

      return thisDuration.isRest || !thisDuration.notes.length;
    })
  ) {
    cellClassName += ` ${cellBaseClassName}--Empty`;
  }

  return (
    <div
      className={cellClassName}
      onClick={() => {
        const durationIdToSelect = getMeasure().durations[0];

        dispatchApp({ type: SELECT_TRACK, trackNumber });
        dispatchApp({ type: SELECT_MEASURE, measureNumber });
        dispatchApp({ type: SELECT_DURATION, durationId: durationIdToSelect });
      }}
    ></div>
  );
};

export default GlobalView;
