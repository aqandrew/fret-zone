import React from 'react';

import './Pitch.scss';

// Scientific pitch notation for a given pitch
const Pitch = ({ note, octave, isNotePresent }) => {
  let pitchClassName = 'Pitch';

  // TODO Refactor using classnames utility
  // Explicitly checking if false here, because we don't want the modifier class if prop is  undefined
  if (isNotePresent === false) {
    pitchClassName += ` ${pitchClassName}--IsOpenString`;
  }

  return (
    <label className={pitchClassName}>
      {note}
      <sub className="Pitch__Octave">{octave}</sub>
    </label>
  );
};

export default Pitch;
