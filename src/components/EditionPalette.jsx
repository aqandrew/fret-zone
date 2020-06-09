import React from 'react';
import { useDispatch } from 'react-redux';

import { addRest } from '../slices/document';
import RadioButton from './RadioButton';
import CheckboxButton from './CheckboxButton';
import { durationLengths } from '../constants';

import './EditionPalette.scss';

const EditionPalette = ({ selectedDuration, onDurationRadioChange }) => (
  <div className="EditionPalette">
    {/* TODO GlobalOptions */}
    {/* TODO MeasureOptions */}
    <NoteSymbols
      selectedDuration={selectedDuration}
      onDurationRadioChange={onDurationRadioChange}
    />
    {/* TODO EmbellishmentOptions */}
    {/* TODO AnnotationOptions */}
    {/* TODO TempoAndVolumeOptions */}
  </div>
);

const NoteSymbols = ({ selectedDuration, onDurationRadioChange }) => {
  const dispatch = useDispatch();

  return (
    <div className="NoteSymbols">
      {Object.keys(durationLengths).map((length) => (
        <RadioButton
          name="duration"
          buttonTitle={`${durationLengths[length].name} Note`}
          disabled={!selectedDuration}
          isChecked={selectedDuration?.length === +length}
          onChange={() => onDurationRadioChange(length)}
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
