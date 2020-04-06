import React from 'react';

import './InspectorViewButton.scss';

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

export default InspectorViewButton;
