import React from 'react';
import { useDispatch } from 'react-redux';

import {
  addRest,
  setDurationLength,
  setDurationDotted,
} from '../slices/document';
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
  const dispatch = useDispatch();

  return (
    <div className="NoteSymbols">
      {Object.keys(durationLengths).map((length) => (
        <RadioButton
          name="duration"
          buttonTitle={`${durationLengths[length].name} Note`}
          disabled={!selectedDuration}
          isChecked={selectedDuration?.length === +length}
          onChange={() =>
            dispatch(
              setDurationLength({
                durationId: selectedDuration.id,
                newLength: +length,
              })
            )
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
            dispatch(addRest(selectedDuration.id));
          }
        }}
      />
      <CheckboxButton
        buttonTitle="Dotting"
        disabled={!selectedDuration}
        isChecked={selectedDuration?.isDotted || false}
        setChecked={(isDotted) => {
          dispatch(
            setDurationDotted({
              durationId: selectedDuration.id,
              isDotted: isDotted,
            })
          );
        }}
      />
    </div>
  );
};

export default EditionPalette;
