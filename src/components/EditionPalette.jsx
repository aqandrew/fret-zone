import React from 'react';

import RadioButton from './RadioButton';
import { durationLengths } from '../constants';

import './EditionPalette.scss';

const EditionPalette = ({ selectedDuration, onDurationRadioChange }) => {
  const renderNoteOptions = () =>
    Object.keys(durationLengths).map((length) => (
      <RadioButton
        name="duration"
        buttonTitle={`${durationLengths[length].name} Note`}
        disabled={!selectedDuration}
        isChecked={selectedDuration?.length === +length}
        onChange={() => onDurationRadioChange(length)}
        key={length}
      />
    ));

  return (
    <div className="EditionPalette">
      {/* TODO GlobalOptions */}
      {/* TODO MeasureOptions */}
      <div className="NoteOptions">{renderNoteOptions()}</div>
      {/* TODO EmbellishmentOptions */}
      {/* TODO AnnotationOptions */}
      {/* TODO TempoAndVolumeOptions */}
    </div>
  );
};

export default EditionPalette;
