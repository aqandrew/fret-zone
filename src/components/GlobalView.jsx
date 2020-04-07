import React from 'react';

import './GlobalView.scss';

const GlobalView = () => {
  // TODO How to share this function with AppMenu?
  const openAddTrackModal = () => {
    console.log('TODO open Add Track modal');
  };

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
      <div className="GlobalView__Controls--Bottom">
        <span className="GlobalView__Heading">Master</span>
      </div>
    </div>
  );
};

export default GlobalView;
