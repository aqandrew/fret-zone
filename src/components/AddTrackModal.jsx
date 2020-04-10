import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTrack } from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const defaultTrackToAdd = { name: 'Electric Guitar - Clean' };
  const [trackToAdd, setTrackToAdd] = useState(defaultTrackToAdd);

  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onClose={onClose}
      // TODO Newly added track must be selected upon creation
      onConfirm={() => dispatch(addTrack(trackToAdd))}
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
