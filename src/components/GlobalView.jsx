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

  return (
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
      {/* TODO Turn this into an <ol>,
      because only GlobalView cares about trackIndex, and can determine it by itself */}
      {renderTrackControls()}
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
      <span className="TrackControl__TrackNumber">{index + 1}.</span>
      {track.fullName}
    </div>
  );
};

export default GlobalView;
