import React from 'react';

import RadioButton from './RadioButton';
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

const NoteSymbols = ({ selectedDuration, onDurationRadioChange }) => (
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
  </div>
);

export default EditionPalette;
