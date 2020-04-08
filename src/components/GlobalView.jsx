import React from 'react';
import { useSelector } from 'react-redux';

import { tracksSelector } from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
  const tracks = useSelector(tracksSelector);

  const renderTrackControls = () =>
    tracks.map((track, index) => {
      return <div key={index}>{track.name}</div>;
    });

  return (
    <div className="GlobalView">
      <div className="GlobalView__Controls--Top">
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
      <div className="GlobalView__Controls--Bottom">
        <span className="GlobalView__Heading">Master</span>
      </div>
    </div>
  );
};

export default GlobalView;
