import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { addTrack } from '../slices/document';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const defaultTrackToAdd = {
    fullName: 'Electric Guitar - Clean',
    abbreviatedName: 'el.guit.',
    tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
  };
  const [trackToAdd, setTrackToAdd] = useState(defaultTrackToAdd);

  const confirmAddTrack = () => {
    dispatch(addTrack({ id: uuidv4(), ...trackToAdd }));
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
        value={defaultTrackToAdd.fullName}
        checked={trackToAdd.fullName === defaultTrackToAdd.fullName}
        onChange={event => {
          setTrackToAdd(event.target.value);
        }}
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        {defaultTrackToAdd.fullName}
        <br />
        Tuning:
        <ol>
          {defaultTrackToAdd.tuning.reverse().map((string, stringIndex) => (
            <li key={stringIndex}>{string}</li>
          ))}
        </ol>
      </label>
    </Modal>
  );
};

export default AddTrackModal;
