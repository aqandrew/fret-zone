import React, { useState } from 'react';
import { NOTES_SHARP } from '../constants';

import Modal from './Modal';
import Pitch from './Pitch';

const AddTrackModal = ({ show, onClose }) => {
	// TODO Move this object to document.js
	const defaultTrackOptions = {
		fullName: 'Clean Guitar',
		abbreviatedName: 'el.guit.',
		tuning: [
			{ note: NOTES_SHARP[4], octave: 2 }, // E
			{ note: NOTES_SHARP[9], octave: 2 }, // A
			{ note: NOTES_SHARP[2], octave: 3 }, // D
			{ note: NOTES_SHARP[7], octave: 3 }, // G
			{ note: NOTES_SHARP[11], octave: 3 }, // B
			{ note: NOTES_SHARP[4], octave: 4 }, // E
		],
	};

	const [trackToAdd, setTrackToAdd] = useState(defaultTrackOptions);

	const confirmAddTrack = () => {
		onClose(trackToAdd);
	};

	return (
		<Modal
			modalTitle="Add Track"
			show={show}
			onClose={onClose}
			onConfirm={confirmAddTrack}
		>
			{/* TODO Change this to a list-select input */}
			<input
				type="radio"
				id="AddTrack__Guitar--Electric--Clean"
				value={defaultTrackOptions.fullName}
				checked={trackToAdd.fullName === defaultTrackOptions.fullName}
				onChange={(event) => {
					setTrackToAdd(event.target.value);
				}}
			/>
			<label htmlFor="AddTrack__Guitar--Electric--Clean">
				{defaultTrackOptions.fullName}
				<br />
				Tuning:
				{/* TODO This can just be a dropdown with the option "Standard" instead of an ol of Pitches */}
				<ol>
					{defaultTrackOptions.tuning.reverse().map((pitch, stringNumber) => (
						<li key={stringNumber}>
							<Pitch {...pitch} />
						</li>
					))}
				</ol>
			</label>
		</Modal>
	);
};

export default AddTrackModal;
