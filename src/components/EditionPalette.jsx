import React from 'react';

import RadioButton from './RadioButton';

import './EditionPalette.scss';

// TODO Populate props based on selected measure/note
const EditionPalette = () => (
  <div className="EditionPalette">
    {/* TODO GlobalOptions */}
    {/* TODO MeasureOptions */}
    <div className="NoteOptions">
      <RadioButton name="duration" buttonTitle="Whole Note" />
      <RadioButton name="duration" buttonTitle="Half Note" />
      {/* TODO Select Quarter Note by default */}
      <RadioButton name="duration" buttonTitle="Quarter Note" />
      <RadioButton name="duration" buttonTitle="Eighth Note" />
      <RadioButton name="duration" buttonTitle="Sixteenth Note" />
      <RadioButton name="duration" buttonTitle="Thirty-Second Note" />
      <RadioButton name="duration" buttonTitle="Sixty-Fourth Note" />
    </div>
    {/* TODO EmbellishmentOptions */}
    {/* TODO AnnotationOptions */}
    {/* TODO TempoAndVolumeOptions */}
  </div>
);

export default EditionPalette;
