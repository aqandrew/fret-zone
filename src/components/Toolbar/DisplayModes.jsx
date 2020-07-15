import React from 'react';

import { displayModes } from '../../constants';

import './DisplayModes.scss';

const DisplayModes = ({ displayModeIndex, setDisplayModeIndex }) => (
  <select
    className="DisplayModes"
    title={
      displayModes[displayModeIndex].mode +
      ' - ' +
      displayModes[displayModeIndex].orientation
    }
    value={displayModeIndex}
    onChange={(event) => {
      setDisplayModeIndex(event.target.value);
    }}
  >
    {displayModes.map((displayMode, i) => (
      <option value={i} key={i}>
        {displayMode.mode} - {displayMode.orientation}
      </option>
    ))}
  </select>
);

export default DisplayModes;
