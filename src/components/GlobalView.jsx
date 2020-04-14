import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectTrack, selectedTrackIndexSelector } from '../slices/ui';
import { tracksSelector } from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const selectedTrackIndex = useSelector(selectedTrackIndexSelector);

  const renderTrackControls = () =>
    tracks.map((track, index) => (
      <TrackControl
        track={track}
        index={index}
        isSelected={index === selectedTrackIndex}
        setSelectedTrackIndex={trackIndex => dispatch(selectTrack(trackIndex))}
        key={index}
      />
    ));

  const renderMeasureTable = () =>
    tracks.map((track, index) => (
      <MeasureTableRow
        track={track}
        index={index}
        setSelectedTrackIndex={trackIndex => dispatch(selectTrack(trackIndex))}
        key={index}
      />
    ));

  return (
    // TODO Redefine HTML structure as follows:
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

const TrackControl = ({ track, index, isSelected, setSelectedTrackIndex }) => {
  let trackControlClassName = 'TrackControl';

  // TODO Refactor using classnames utility
  if (isSelected) {
    trackControlClassName += ` ${trackControlClassName}--IsActive`;
  }

  return (
    <div
      className={trackControlClassName}
      onClick={() => setSelectedTrackIndex(index)}
    >
      <div className="TrackControl__ColorTab"></div>
      <span className="TrackControl__TrackNumber">{index + 1}.</span>
      {track.fullName}
    </div>
  );
};

const MeasureTableRow = ({ track, index, setSelectedTrackIndex }) => {
  return (
    <div className="MeasureTable__Row">
      {track.measures.map(measureId => (
        <div
          className="MeasureTable__Cell"
          onClick={() => setSelectedTrackIndex(index)}
          key={measureId}
        ></div>
      ))}
    </div>
  );
};

export default GlobalView;
