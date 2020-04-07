import React from 'react';

import './Modal.scss';

const Modal = ({ children, modalTitle, show, onCancel, onConfirm }) => {
  return (
    show && (
      <div className="Modal__Backdrop">
        <div className="Modal">
          <h2 className="Modal__Heading">{modalTitle}</h2>
          {children}
          <div className="Modal__Footer">
            <button className="Modal__FooterButton--Cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="Modal__FooterButton--Confirm"
              onClick={onConfirm}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
