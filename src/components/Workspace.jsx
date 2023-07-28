import React, { useContext } from 'react';
import clsx from 'clsx';

import { SELECT_MEASURE, SELECT_DURATION, SELECT_STRING } from '../actionTypes';
import AppStateContext from '../AppStateContext';
import DispatchContext from '../DispatchContext';
import { useDocument } from '../hooks/useDocument';
import { DURATION_LENGTHS } from '../constants';

import './Workspace.scss';

const Workspace = ({ documentTitle, documentArtist }) => (
	<div className="Workspace">
		<div className="Document__Page">
			{documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
			{documentArtist && <h2 className="Document__Artist">{documentArtist}</h2>}
			<SelectedTrackNotation />
		</div>
	</div>
);

const SelectedTrackNotation = () => {
	const appState = useContext(AppStateContext);
	const { tracks, measures, durations, selectedTrack } = useDocument(appState);

	if (tracks.length && measures.length) {
		const measuresInSelectedTrack = selectedTrack.measures.map((measureId) =>
			measures.find((measure) => measure.id === measureId)
		);

		return (
			<div className="TrackNotation">
				<span className="TrackNotation__TrackName--Abbreviated">
					{selectedTrack.abbreviatedName}
				</span>
				{measuresInSelectedTrack.map((measure, measureNumber) => {
					const durationsInMeasure = measure.durations.map((durationId) =>
						durations.find((duration) => duration.id === durationId)
					);

					return (
						<div className="Measure" aria-label="Measure" key={measureNumber}>
							{durationsInMeasure.map((duration) => (
								<DurationColumn
									measureNumber={measureNumber}
									duration={duration}
									key={
										duration
											? duration.id
											: selectedTrack.measures[measureNumber].id
									}
								/>
							))}
							{/* TODO Add (OR bar duration !== maximum) to ternary condition */}
							{durationsInMeasure.length === 0 ? (
								<DurationColumn measureNumber={measureNumber} duration={null} />
							) : null}
						</div>
					);
				})}
			</div>
		);
	}

	return null;
};

const DurationColumn = ({ measureNumber, duration }) => {
	const dispatch = useContext(DispatchContext);
	const appState = useContext(AppStateContext);
	const {
		notes,
		selectedTrack,
		selectedMeasureNumber,
		selectedDurationId,
		selectedStringNumber,
	} = useDocument(appState);

	return (
		<div className="Measure__DurationColumn" aria-label="Duration">
			{selectedTrack.tuning.map((stringTuning, stringNumber) => {
				const baseClassname = 'Measure__Input';
				const noteAtString = duration.notes
					.map((noteId) => notes.find((note) => note.id === noteId))
					.find((note) => note.string === stringNumber);
				const isActive =
					measureNumber === selectedMeasureNumber &&
					stringNumber === selectedStringNumber &&
					duration.id === selectedDurationId;

				return (
					<input
						className={clsx(
							baseClassname,
							isActive && `${baseClassname}--IsActive`
						)}
						type="text"
						aria-label={`Measure input${isActive ? ' (Selected)' : ''}`}
						readOnly
						value={
							duration
								? duration.isRest
									? 'R'
									: noteAtString
									? // TODO noteAtString.fret should probably be returned by a function that includes symbols for slides/vibrato/etc
									  noteAtString.fret
									: '-'
								: '-'
						}
						onClick={() => {
							dispatch({ type: SELECT_MEASURE, measureNumber });
							dispatch({ type: SELECT_STRING, stringNumber });
							dispatch({ type: SELECT_DURATION, durationId: duration.id });
						}}
						key={stringNumber}
					/>
				);
			})}
			<DurationMarker duration={duration} />
		</div>
	);
};

const DurationMarker = ({ duration }) => (
	<span className="Measure__DurationMarker">
		{/* TODO Account for triplet length */}
		{DURATION_LENGTHS[duration.length].abbreviation}
		{duration.isDotted && '.'}
	</span>
);

export default Workspace;
