import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectTrack,
  selectedTrackIndexSelector,
  selectMeasure,
  selectedMeasureNumberSelector
} from '../slices/ui';
import { tracksSelector } from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
  const tracks = useSelector(tracksSelector);

  const renderTrackControls = () =>
    tracks.map((track, index) => (
      <TrackControl track={track} index={index} key={index} />
    ));

  const renderMeasureTable = () =>
    tracks.map((track, index) => (
      <MeasureTableRow track={track} trackIndex={index} key={index} />
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

const TrackControl = ({ track, index }) => {
  const dispatch = useDispatch();
  const selectedTrackIndex = useSelector(selectedTrackIndexSelector);

  let trackControlClassName = 'TrackControl';

  // TODO Refactor using classnames utility
  if (index === selectedTrackIndex) {
    trackControlClassName += ` ${trackControlClassName}--IsActive`;
  }

  return (
    <div
      className={trackControlClassName}
      onClick={() => dispatch(selectTrack(index))}
    >
      <div className="TrackControl__ColorTab"></div>
      <span className="TrackControl__TrackNumber">{index + 1}.</span>
      {track.fullName}
    </div>
  );
};

const MeasureTableRow = ({ track, trackIndex }) => {
  const dispatch = useDispatch();
  const selectedTrackIndex = useSelector(selectedTrackIndexSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  return (
    <div className="MeasureTable__Row">
      {track.measures.map((measureId, measureIndex) => {
        let cellClassName = 'MeasureTable__Cell';

        // TODO Refactor using classnames utility
        if (
          trackIndex === selectedTrackIndex &&
          measureIndex === selectedMeasureNumber - 1
        ) {
          cellClassName += ` ${cellClassName}--IsSelected`;
        }

        return (
          <div
            className={cellClassName}
            onClick={() => {
              dispatch(selectTrack(trackIndex));
              dispatch(selectMeasure(measureIndex + 1));
            }}
            key={measureId}
          ></div>
        );
      })}
    </div>
  );
};

export default GlobalView;
