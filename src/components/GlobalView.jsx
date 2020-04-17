import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectTrack,
  selectedTrackNumberSelector,
  selectMeasure,
  selectedMeasureNumberSelector
} from '../slices/ui';
import { tracksSelector } from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  const renderTrackControls = () =>
    tracks.map((track, trackNumber) => (
      <TrackControl track={track} trackNumber={trackNumber} key={trackNumber} />
    ));

  const renderMeasureTable = () =>
    tracks.map((track, TrackNumber) => (
      <MeasureTableRow
        track={track}
        trackNumber={TrackNumber}
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
                (measure, measureNumber) => {
                  let measureNumberClassName = 'MeasureTable__MeasureNumber';

                  // TODO Refactor using classnames utility
                  if (measureNumber === selectedMeasureNumber) {
                    measureNumberClassName += ` ${measureNumberClassName}--IsSelected`;
                  }

                  return (
                    <div
                      className={measureNumberClassName}
                      onClick={() => dispatch(selectMeasure(measureNumber))}
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

const TrackControl = ({ track, trackNumber }) => {
  const dispatch = useDispatch();
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);

  let trackControlClassName = 'TrackControl';

  // TODO Refactor using classnames utility
  if (trackNumber === selectedTrackNumber) {
    trackControlClassName += ` ${trackControlClassName}--IsActive`;
  }

  return (
    <div
      className={trackControlClassName}
      onClick={() => dispatch(selectTrack(trackNumber))}
    >
      <div className="TrackControl__ColorTab"></div>
      <span className="TrackControl__TrackNumber">{trackNumber + 1}.</span>
      {track.fullName}
    </div>
  );
};

const MeasureTableRow = ({ track, trackNumber }) => {
  const dispatch = useDispatch();
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  return (
    <div className="MeasureTable__Row">
      {track.measures.map((measureId, measureNumber) => {
        let cellClassName = 'MeasureTable__Cell';

        // TODO Refactor using classnames utility
        if (
          trackNumber === selectedTrackNumber &&
          measureNumber === selectedMeasureNumber
        ) {
          cellClassName += ` ${cellClassName}--IsSelected`;
        }

        return (
          <div
            className={cellClassName}
            onClick={() => {
              dispatch(selectTrack(trackNumber));
              dispatch(selectMeasure(measureNumber));
            }}
            key={measureId}
          ></div>
        );
      })}
    </div>
  );
};

export default GlobalView;
