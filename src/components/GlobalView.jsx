import React from 'react';
import { useSelector } from 'react-redux';

import { tracksSelector } from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({
  selectedTrackIndex,
  setSelectedTrackIndex,
  openAddTrackModal
}) => {
  const tracks = useSelector(tracksSelector);

  const renderTrackControls = () =>
    tracks.map((track, index) => (
      <TrackControl
        track={track}
        index={index}
        isSelected={index === selectedTrackIndex}
        setSelectedTrackIndex={setSelectedTrackIndex}
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
      {track.name}
    </div>
  );
};

export default GlobalView;
