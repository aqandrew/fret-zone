import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { addTrack } from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const defaultTrackToAdd = { name: 'Electric Guitar - Clean' };
  const [trackToAdd, setTrackToAdd] = useState(defaultTrackToAdd);

  const confirmAddTrack = () => {
    dispatch(addTrack(uuidv4(), trackToAdd));
    // TODO If this is the first track being added, add a new measure
    // TODO Once the new track is added, set is as the currently selected track
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
        value={defaultTrackToAdd.name}
        checked={trackToAdd.name === defaultTrackToAdd.name}
        onChange={event => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackToAdd.name}
      </label>
    </Modal>
  );
};

export default AddTrackModal;
