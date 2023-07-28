import React, { useContext } from 'react';

import { NOTES_SHARP } from '../../constants';
import AppStateContext from '../../AppStateContext';
import { useDocument } from '../../hooks/useDocument';
import Pitch from '../Pitch';

const PitchAtCursor = () => {
	const appState = useContext(AppStateContext);
	const {
		notes,
		selectedTrack,
		selectedDuration,
		selectedStringNumber,
		selectedPositionHasNote,
	} = useDocument(appState);

	// TODO Pitch evaluation should probably be moved to utility function,
	// for when ability to draw staff notation is added

	// If on an open string, or if there are no notes, return that string's pitch
	const openStringPitch = selectedTrack?.tuning[selectedStringNumber];
	let pitch = { ...openStringPitch };

	if (selectedPositionHasNote) {
		let noteIndex = NOTES_SHARP.indexOf(pitch.note);
		// TODO Remove duplicated code between this and Workspace.jsx:DurationColumn
		const noteAtString = selectedDuration.notes
			.map((noteId) => notes.find((note) => note.id === noteId))
			.find((note) => note.string === selectedStringNumber);

		// Add appropriate number of semitones on top of string's tuning
		noteIndex = (noteIndex + noteAtString.fret) % NOTES_SHARP.length;
		pitch.note = NOTES_SHARP[noteIndex];

		// And increase octave as necessary
		const openStringSemitonesToNextOctave =
			NOTES_SHARP.length - NOTES_SHARP.indexOf(openStringPitch.note);

		pitch.octave +=
			Math.floor(
				(noteAtString.fret - openStringSemitonesToNextOctave) /
					NOTES_SHARP.length
			) + 1;
	}

	return <Pitch {...{ ...pitch, selectedPositionHasNote }} />;
};

export default PitchAtCursor;
