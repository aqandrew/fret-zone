import React, { useState } from 'react';

import './Inspector.scss';

const Inspector = () => {
  const [showSongView, setShowSongView] = useState(true);

  return (
    <div className="Inspector">
      <div className="Inspector__ViewSelect">
        <InspectorViewButton
          text="Song"
          isSongView={true}
          isActive={showSongView}
          setShowSongView={setShowSongView}
        />
        <InspectorViewButton
          text="Track"
          isSongView={false}
          isActive={!showSongView}
          setShowSongView={setShowSongView}
        />
      </div>
      {showSongView ? (
        <div className="Inspector__Body">
          <h2 className="Inspector__Heading">Information</h2>
          <h2 className="Inspector__Heading">Musical Notation</h2>
          <h2 className="Inspector__Heading">Sound Mastering</h2>
        </div>
      ) : (
        <div className="Inspector__Body">
          <h2 className="Inspector__Heading">Information</h2>
          <h2 className="Inspector__Heading">Musical Notation</h2>
          <h2 className="Inspector__Heading">Sounds</h2>
          <h2 className="Inspector__Heading">Interpretation</h2>
        </div>
      )}
    </div>
  );
};

const InspectorViewButton = ({
  text,
  isSongView,
  isActive,
  setShowSongView
}) => {
  let inspectorViewButtonClass = 'Inspector__ViewButton';

  // TODO Refactor using classnames utility
  if (isActive) {
    inspectorViewButtonClass += ` ${inspectorViewButtonClass}--IsActive`;
  }

  return (
    <div
      className={inspectorViewButtonClass}
      onClick={() => {
        setShowSongView(isSongView);
      }}
    >
      {text}
    </div>
  );
};

export default Inspector;
