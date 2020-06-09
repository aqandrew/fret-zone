import React from 'react';
import { useDispatch } from 'react-redux';

import { addRest, setDurationLength } from '../slices/document';
import RadioButton from './RadioButton';
import CheckboxButton from './CheckboxButton';
import { durationLengths } from '../constants';

import './EditionPalette.scss';

const EditionPalette = ({ selectedDuration }) => (
  <div className="EditionPalette">
    {/* TODO MiscEdition */}
    {/* TODO BarSymbols */}
    <NoteSymbols selectedDuration={selectedDuration} />
    {/* TODO EffectSymbols */}
    {/* TODO NotationSymbols */}
    {/* TODO AutomationSymbols */}
  </div>
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
    </div>
  );
};

export default EditionPalette;
