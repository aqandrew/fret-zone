import React from 'react';

import { DISPLAY_MODES } from '../../constants';

import './DisplayModes.scss';

const DisplayModes = ({ displayModeIndex, setDisplayModeIndex }) => (
	<select
		className="DisplayModes"
		title={
			DISPLAY_MODES[displayModeIndex].mode +
			' - ' +
			DISPLAY_MODES[displayModeIndex].orientation
		}
		value={displayModeIndex}
		onChange={(event) => {
			setDisplayModeIndex(event.target.value);
		}}
	>
		{DISPLAY_MODES.map((displayMode, i) => (
			<option value={i} key={i}>
				{displayMode.mode} - {displayMode.orientation}
			</option>
		))}
	</select>
);

export default DisplayModes;
