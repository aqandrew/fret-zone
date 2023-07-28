import React, { useContext } from 'react';
import Emoji from 'a11y-react-emoji';

import AppStateContext from '../../AppStateContext';
import { useDocument } from '../../hooks/useDocument';
import CheckboxButton from '../CheckboxButton';
import Zoom from './Zoom';
import DisplayModes from './DisplayModes';
import PitchAtCursor from './PitchAtCursor';
import BarCurrentDuration from './BarCurrentDuration';

import './ToolBar.scss';

const ToolBar = ({
	isEditionPaletteShown,
	setIsEditionPaletteShown,
	isGlobalViewShown,
	setIsGlobalViewShown,
	isInspectorShown,
	setIsInspectorShown,
	zoomLevel,
	setZoomLevel,
	displayModeIndex,
	setDisplayModeIndex,
}) => {
	const appState = useContext(AppStateContext);
	const { tracks, measures, selectedTrackNumber, selectedMeasureNumber } =
		useDocument(appState);

	return (
		<div className="ToolBar">
			<div className="ToolBar__Group ToolBar__Group--Left">
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Panels">
					<CheckboxButton
						buttonText="["
						buttonTitle="Show/Hide Edition Palette"
						isChecked={isEditionPaletteShown}
						setChecked={setIsEditionPaletteShown}
					/>
					<CheckboxButton
						buttonText="_"
						buttonTitle="Show/Hide Global View"
						isChecked={isGlobalViewShown}
						setChecked={setIsGlobalViewShown}
					/>
					<CheckboxButton
						buttonText="]"
						buttonTitle="Show/Hide Inspector"
						isChecked={isInspectorShown}
						setChecked={setIsInspectorShown}
					/>
				</div>
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Workspace">
					<Zoom zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
					<DisplayModes
						displayModeIndex={displayModeIndex}
						setDisplayModeIndex={setDisplayModeIndex}
					/>
				</div>
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--History">
					<button title="Undo">
						<Emoji symbol="↩️" />
					</button>
					<button title="Redo">
						<Emoji symbol="↪️" />
					</button>
				</div>
				<button title="Print...">
					<Emoji symbol="🖨" />
				</button>
			</div>

			<div className="ToolBar__Group ToolBar__Group--Center">
				<div className="NavigationAndPlayback">
					<button
						className="NavigationAndPlayback__Button NavigationAndPlayback__Button--FirstBar"
						title="Go to first bar"
					>
						<Emoji symbol="⏮" />
					</button>
					<button
						className="NavigationAndPlayback__Button NavigationAndPlayback__Button--PreviousBar"
						title="Go to previous bar"
					>
						<Emoji symbol="⏪" />
					</button>
					<button
						className="NavigationAndPlayback__Button NavigationAndPlayback__Button--PlayPause"
						title="Play"
					>
						<Emoji symbol="▶️" />
					</button>
					<button
						className="NavigationAndPlayback__Button NavigationAndPlayback__Button--NextBar"
						title="Go to next bar"
					>
						<Emoji symbol="⏩" />
					</button>
					<button
						className="NavigationAndPlayback__Button NavigationAndPlayback__Button--LastBar"
						title="Go to last bar"
					>
						<Emoji symbol="⏭" />
					</button>
				</div>
				<div className="LCD">
					<select
						className="LCD__Control LCD__Control--CurrentTrack"
						title="Current track (Click to change)"
						value={selectedTrackNumber}
						onChange={(event) => {
							let trackNumberToSelect = +event.target.value;

							// TODO Remove duplicated code between this and TrackControl.onClick
							// Select first duration of track's measure at selectedMeasureNumber
							const durationIdToSelect = measures.find(
								(measure) =>
									measure.id ===
									tracks[trackNumberToSelect].measures[selectedMeasureNumber]
							).durations[0];

							dispatch({
								type: actionTypes.SELECT_TRACK,
								trackNumber: trackNumberToSelect,
							});
							dispatch({
								type: actionTypes.SELECT_DURATION,
								durationId: durationIdToSelect,
							});
						}}
					>
						{tracks.map((track, trackNumber) => (
							<option value={trackNumber} key={trackNumber}>{`${
								trackNumber + 1
							}. ${track.fullName}`}</option>
						))}
					</select>
					<button
						className="LCD__Control LCD__Control--CountIn"
						title="Activate/Deactivate count-in"
					>
						<Emoji symbol="⌛️" />
					</button>
					<button
						className="LCD__Control LCD__Control--Metronome"
						title="Activate/Deactivate metronome"
					>
						<Emoji symbol="⏲" />
					</button>
					<button
						className="LCD__Control LCD__Control--MetronomeSettings"
						title="Metronome & Count-in settings"
					>
						<Emoji symbol="🍡" />
					</button>
					<div
						className="LCD__Control LCD__Control--PitchAtCursor LCD__Control--NoHover"
						title="Note on the cursor"
					>
						<PitchAtCursor />
					</div>
					{/* TODO Click to open "Go to" modal */}
					<button
						className="LCD__Control LCD__Control--BarPosition"
						title="Bar position"
					>
						{selectedMeasureNumber + 1}/
						{tracks.length ? tracks[selectedTrackNumber].measures.length : 0}
					</button>
					<BarCurrentDuration />
					<div
						className="LCD__Control LCD__Control--Time LCD__Control--NoHover"
						title="Time"
					>
						00:00 / 00:00
					</div>
					<button
						className="LCD__Control LCD__Control--TripletFeel"
						title="No triplet feel"
					>
						<Emoji symbol="🎶" />
					</button>
					<button
						className="LCD__Control LCD__Control--Tempo"
						title="Current tempo"
					>
						d = 120
					</button>
					<button
						className="LCD__Control LCD__Control--TimeSignature"
						title="Time signature"
					>
						4/4
					</button>
					<input
						type="range"
						name="time"
						id="time"
						className="LCD__Control LCD__Control--TimeScrubber"
					/>
				</div>
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--LoopAndPlaybackSettings">
					<button title="Enable loop">
						<Emoji symbol="🔁" />
					</button>
					<button title="Relative speed">
						<Emoji symbol="🎵" /> 100%
					</button>
				</div>
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--GlobalTonality">
					<button title="Enable/Disable relative tonality">
						<Emoji symbol="🍴" /> 0
					</button>
				</div>
			</div>

			<div className="ToolBar__Group ToolBar__Group--Right">
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--InstrumentViews">
					<button title="Show/Hide Fretboard View">
						<Emoji symbol="🎸" />
					</button>
					<button title="Show/Hide Keyboard View">
						<Emoji symbol="🎹" />
					</button>
					<button title="Show/Hide Virtual Drum Kit">
						<Emoji symbol="🥁" />
					</button>
				</div>
				<div className="ToolBar__ButtonContainer ToolBar__ButtonContainer--Listeners">
					<button title="Tuner">
						<Emoji symbol="🔔" />
					</button>
					<button title="Line-in">
						<Emoji symbol="🔌" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ToolBar;
