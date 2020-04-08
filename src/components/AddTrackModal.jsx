import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTrack } from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const defaultTrackToAdd = 'Electric Guitar - Clean';
  const [trackToAdd, setTrackToAdd] = useState(defaultTrackToAdd);

  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onClose={onClose}
      onConfirm={() => dispatch(addTrack(trackToAdd))}
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
