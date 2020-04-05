import React from 'react';

import CheckboxButton from './CheckboxButton';
import './ScoreControls.scss';

const ScoreControls = ({ activeFile }) => (
  <div id="score-controls">
    <div>{activeFile.name}</div>
    <div>
      <div>
        <CheckboxButton buttonTitle="Show/Hide Edition Palette" />
        <CheckboxButton buttonTitle="Show/Hide Global View" />
        <CheckboxButton buttonTitle="Show/Hide Inspector" />
      </div>
      {/* TODO Zoom control */}
      {/* TODO Document view select */}
      {/* TODO Undo/redo */}
      {/* TODO Print */}
      {/* TODO PlaybackControls */}
      {/* TODO Buttons for fretboard/keyboard/drum view */}
    </div>
  </div>
);

export default ScoreControls;
