import React from 'react';

import './Modal.scss';

const Modal = ({ children, modalTitle, show, onClose, onConfirm }) => {
  return show ? (
    // Even though the backdrop doesn't obscure the rest of the screen,
    // it prevents clicks outside until the modal is closed
    <div className="Modal__Backdrop">
      <div className="Modal">
        <h2 className="Modal__Heading">{modalTitle}</h2>
        {children}
        <div className="Modal__Footer">
          <button className="Modal__FooterButton--Cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="Modal__FooterButton--Confirm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
