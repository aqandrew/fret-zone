import React, { useState } from 'react';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  // TODO Move this object to document.js
  const defaultTrackOptions = {
    fullName: 'Electric Guitar - Clean',
    abbreviatedName: 'el.guit.',
    tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  };

  const [trackToAdd, setTrackToAdd] = useState(defaultTrackOptions);

  const confirmAddTrack = () => {
    onClose(trackToAdd);
  };

  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onClose={onClose}
      onConfirm={confirmAddTrack}
    >
      {/* TODO Change this to a list-select input */}
      <input
        type="radio"
        id="AddTrack__Guitar--Electric--Clean"
        value={defaultTrackOptions.fullName}
        checked={trackToAdd.fullName === defaultTrackOptions.fullName}
        onChange={(event) => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackOptions.fullName}
        <br />
        Tuning:
        <ol>
          {defaultTrackOptions.tuning
            .reverse()
            .map((stringTuning, stringNumber) => (
              <li key={stringNumber}>{stringTuning}</li>
            ))}
        </ol>
      </label>
    </Modal>
  );
};

export default AddTrackModal;
