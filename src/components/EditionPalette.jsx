import React, { useContext } from 'react';

import * as actionTypes from '../actionTypes';
import DispatchContext from '../DispatchContext';
import RadioButton from './RadioButton';
import CheckboxButton from './CheckboxButton';
import { durationLengths } from '../constants';

import './EditionPalette.scss';

const EditionPalette = ({ selectedDuration }) => (
  <section className="EditionPalette" aria-label="Edition Palette">
    {/* TODO MiscEdition */}
    {/* TODO BarSymbols */}
    <NoteSymbols selectedDuration={selectedDuration} />
    {/* TODO EffectSymbols */}
    {/* TODO NotationSymbols */}
    {/* TODO AutomationSymbols */}
  </section>
);

const NoteSymbols = ({ selectedDuration }) => {
  const dispatch = useContext(DispatchContext);

  return (
    <div className="NoteSymbols">
      {Object.keys(durationLengths).map((length) => (
        <RadioButton
          name="duration"
          buttonTitle={`${durationLengths[length].name} Note`}
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
