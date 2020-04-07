import React from 'react';

import Modal from './Modal';

const AddTrackModal = ({ show, onClose }) => {
  return (
    <Modal
      modalTitle="Add Track"
      show={show}
      onCancel={onClose}
      onConfirm={() => {
        console.log('TODO Add clean guitar track');
        onClose();
      }}
    >
      {/* TODO Change this to a list-select input */}
      <input
        type="radio"
        id="AddTrack__Guitar--Electric--Clean"
        defaultChecked
      />
      <label htmlFor="AddTrack__Guitar--Electric--Clean">
        Electric Guitar - Clean
      </label>
    </Modal>
  );
};

export default AddTrackModal;
