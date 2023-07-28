import React, { useContext } from 'react';
import clsx from 'clsx';

import DispatchContext from '../DispatchContext';
import AppStateContext from '../AppStateContext';
import { useDocument } from '../hooks/useDocument';
import { SELECT_TRACK, SELECT_MEASURE, SELECT_DURATION } from '../actionTypes';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
	const appState = useContext(AppStateContext);
	const { tracks } = useDocument(appState);

	return (
		<div className="GlobalView">
			<div className="TrackControls">
				<div className="TrackControls__Header">
					<button
						className="TrackControls__Button--AddTrack"
						title="Add Track"
						onClick={openAddTrackModal}
					>
						+
					</button>
					<span className="TrackControls__Heading">Tracks</span>
				</div>
				{tracks.map((track, trackNumber) => (
					<TrackControl
						track={track}
						trackNumber={trackNumber}
						key={trackNumber}
					/>
				))}
				<div className="TrackControls__Footer">
					<span className="TrackControls__Heading">Master</span>
				</div>
			</div>
			<MeasureTable />
		</div>
	);
};

const TrackControl = ({ track, trackNumber }) => {
	const dispatch = useContext(DispatchContext);
	const appState = useContext(AppStateContext);
	const { tracks, measures, selectedTrackNumber, selectedMeasureNumber } =
		useDocument(appState);
	const baseClassName = 'TrackControl';

	return (
		<div
			className={clsx(
				baseClassName,
				trackNumber === selectedTrackNumber && `${baseClassName}--IsActive`
			)}
			onClick={() => {
				// TODO Remove duplicated code between this and .LCD__Control--CurrentTrack.onChange
				// Select first duration of track's measure at selectedMeasureNumber
				const durationIdToSelect = measures.find(
					(measure) =>
						measure.id === tracks[trackNumber].measures[selectedMeasureNumber]
				).durations[0];

				dispatch({ type: SELECT_TRACK, trackNumber });
				dispatch({ type: SELECT_DURATION, durationId: durationIdToSelect });
			}}
		>
			<div className="TrackControl__ColorTab"></div>
			<span className="TrackControl__TrackNumber">{trackNumber + 1}.</span>
			{track.fullName}
		</div>
	);
};

const MeasureTable = () => {
	const dispatch = useContext(DispatchContext);
	const appState = useContext(AppStateContext);
	const { tracks, measures, selectedTrack, selectedMeasureNumber } =
		useDocument(appState);

	return (
		<div className="MeasureTable">
			<div className="MeasureTable__Header">
				{tracks.length
					? selectedTrack.measures.map((measureId, measureNumber) => {
							const baseClassName = 'MeasureTable__MeasureNumber';

							return (
								<div
									className={clsx(
										baseClassName,
										measureNumber === selectedMeasureNumber &&
											`${baseClassName}--IsSelected`
									)}
									onClick={() => {
										const durationIdToSelect = measures.find(
											(measure) => measure.id === measureId
										).durations[0];

										dispatch({ type: SELECT_MEASURE, measureNumber });
										dispatch({
											type: SELECT_DURATION,
											durationId: durationIdToSelect,
										});
									}}
									key={measureNumber}
								>
									{measureNumber + 1}
								</div>
							);
					  })
					: null}
			</div>
			{tracks.map((track, trackNumber) => (
				<div className="MeasureTable__Row" key={trackNumber}>
					{track.measures.map((measureId, measureNumber) => (
						<MeasureTableCell
							measureId={measureId}
							measureNumber={measureNumber}
							trackNumber={trackNumber}
							key={measureId}
						/>
					))}
				</div>
			))}
			<div className="MeasureTable__Footer">
				{/* TODO Show section names */}
			</div>
		</div>
	);
};

const MeasureTableCell = ({ measureId, measureNumber, trackNumber }) => {
	const dispatch = useContext(DispatchContext);
	const appState = useContext(AppStateContext);
	const { measures, durations, selectedTrackNumber, selectedMeasureNumber } =
		useDocument(appState);
	const getMeasure = () => measures.find((measure) => measure.id === measureId);
	const baseClassName = 'MeasureTable__Cell';

	return (
		<div
			className={clsx(
				baseClassName,
				trackNumber === selectedTrackNumber &&
					measureNumber === selectedMeasureNumber &&
					`${baseClassName}--IsSelected`,
				getMeasure().durations.every((durationId) => {
					const thisDuration = durations.find(
						(duration) => duration.id === durationId
					);

					return thisDuration.isRest || !thisDuration.notes.length;
				}) && `${baseClassName}--Empty`
			)}
			onClick={() => {
				const durationIdToSelect = getMeasure().durations[0];

				dispatch({ type: SELECT_TRACK, trackNumber });
				dispatch({ type: SELECT_MEASURE, measureNumber });
				dispatch({ type: SELECT_DURATION, durationId: durationIdToSelect });
			}}
		></div>
	);
};

export default GlobalView;
