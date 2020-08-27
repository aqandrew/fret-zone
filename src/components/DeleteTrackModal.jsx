import React from 'react';

import Modal from './Modal';

const DeleteTrackModal = ({ show, onClose, nameOfTrackToDelete }) => (
  <Modal show={show} onClose={onClose} onConfirm={() => onClose(true)}>
    <strong>Delete track</strong>
    <p>Are you sure you want to delete track "{nameOfTrackToDelete}"?</p>
  </Modal>
);
export default DeleteTrackModal;
