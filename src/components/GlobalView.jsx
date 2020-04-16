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
  const tracks = useSelector(tracksSelector);

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
    // TODO Redefine HTML structure as follows, for correct horizontal scrolling behavior:
    // .GlobalView { display: flex; }
    //   .TrackControls
    //      .TrackControls__Header
    //      .TrackControl
    //      .TrackControl
    //      ...
    //      .TrackControls__Footer
    //   .MeasureTable
    <div className="GlobalView">
      <div className="GlobalView__Controls GlobalView__Controls--Top">
        <button
          className="GlobalView__Button--AddTrack"
          title="Add Track"
          onClick={openAddTrackModal}
        >
          +
        </button>
        <span className="GlobalView__Heading">Tracks</span>
      </div>
      <div className="GlobalView__Content">
        <div className="GlobalView__TrackControls">{renderTrackControls()}</div>
        <div className="MeasureTable">{renderMeasureTable()}</div>
      </div>
      <div className="GlobalView__Controls GlobalView__Controls--Bottom">
        <span className="GlobalView__Heading">Master</span>
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
          measureNumber === selectedMeasureNumber - 1
        ) {
          cellClassName += ` ${cellClassName}--IsSelected`;
        }

        return (
          <div
            className={cellClassName}
            onClick={() => {
              dispatch(selectTrack(trackNumber));
              dispatch(selectMeasure(measureNumber + 1));
            }}
            key={measureId}
          ></div>
        );
      })}
    </div>
  );
};

export default GlobalView;
