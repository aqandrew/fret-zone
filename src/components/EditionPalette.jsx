import React, { useContext } from 'react';

import * as actionTypes from '../actionTypes';
import DispatchContext from '../DispatchContext';
import AppStateContext from '../AppStateContext';
import { useDocument } from '../hooks/useDocument';
import RadioButton from './RadioButton';
import CheckboxButton from './CheckboxButton';
import { DURATION_LENGTHS } from '../constants';

import './EditionPalette.scss';

const EditionPalette = () => (
	<section className="EditionPalette" aria-label="Edition Palette">
		{/* TODO MiscEdition */}
		{/* TODO BarSymbols */}
		<NoteSymbols />
		{/* TODO EffectSymbols */}
		{/* TODO NotationSymbols */}
		{/* TODO AutomationSymbols */}
	</section>
);
const NoteSymbols = () => {
	const dispatch = useContext(DispatchContext);
	const appState = useContext(AppStateContext);
	const { selectedDuration } = useDocument(appState);

	return (
		<div className="NoteSymbols">
			{Object.keys(DURATION_LENGTHS).map((length) => (
				<RadioButton
					name="duration"
					buttonTitle={`${DURATION_LENGTHS[length].name} Note`}
					disabled={!selectedDuration}
					isChecked={selectedDuration?.length === +length}
					onChange={() =>
						dispatch({
							type: actionTypes.SET_DURATION_LENGTH,
							durationId: selectedDuration.id,
							newLength: +length,
						})
					}
					key={length}
				/>
			))}
			<CheckboxButton
				buttonTitle="Rest"
				disabled={!selectedDuration}
				isChecked={selectedDuration?.isRest || false}
				setChecked={(isNotRest) => {
					if (isNotRest) {
						dispatch({
							type: actionTypes.ADD_REST,
							durationId: selectedDuration.id,
						});
					}
				}}
			/>
			<CheckboxButton
				buttonTitle="Dotting"
				disabled={!selectedDuration}
				isChecked={selectedDuration?.isDotted || false}
				setChecked={(isDotted) => {
					dispatch({
						type: actionTypes.SET_DURATION_DOTTED,
						durationId: selectedDuration.id,
						isDotted: isDotted,
					});
				}}
			/>
		</div>
	);
};

export default EditionPalette;
