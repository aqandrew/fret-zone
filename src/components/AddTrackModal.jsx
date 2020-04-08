import React, { useState } from 'react';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const defaultTrackToAdd = 'Electric Guitar - Clean';
  const [trackToAdd, setTrackToAdd] = useState(defaultTrackToAdd);

  // TODO This logic should probably live in Context or Redux store,
  // rather than in the modal's component
  const addTrack = () => {
    console.log('TODO Add track: ' + trackToAdd);
  };

  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onClose={onClose}
      onConfirm={addTrack}
    >
      {/* TODO Change this to a list-select input */}
      <input
        type="radio"
        id="AddTrack__Guitar--Electric--Clean"
        value={defaultTrackToAdd}
        checked={trackToAdd === defaultTrackToAdd}
        onChange={event => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackToAdd}
      </label>
    </Modal>
  );
};

export default AddTrackModal;
