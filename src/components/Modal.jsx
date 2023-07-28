import React, { useRef, useEffect, useCallback } from 'react';

import './Modal.scss';

// Container for modal component
const Modal = ({ children, modalTitle, show, onClose, onConfirm }) => {
	return (
		show && (
			<ShownModal
				modalTitle={modalTitle}
				onClose={onClose}
				onConfirm={onConfirm}
			>
				{children}
			</ShownModal>
		)
	);
};

// The actual modal component
const ShownModal = ({ children, modalTitle, onClose, onConfirm }) => {
	const modalRef = useRef(null);

	const closeWithoutResult = useCallback(() => onClose(null), [onClose]);
	const closeWithResult = useCallback(() => {
		const modalResult = onConfirm();

		onClose(modalResult);
	}, [onClose, onConfirm]);

	useEffect(() => {
		if (!modalRef.current) {
			return;
		}

		const handleKeyDown = (event) => {
			if (event.key === 'Enter') {
				closeWithResult();
			} else if (event.key === 'Escape') {
				closeWithoutResult();
			}

			event.preventDefault();
		};

		const node = modalRef.current;
		node.addEventListener('keydown', handleKeyDown);

		// Select the first input in this modal,
		// so that modalRef will hear the event
		// TODO This may not make sense for every modal
		let focusableElement = node.querySelector('input');

		if (!focusableElement) {
			const confirmLabels = ['OK', 'Yes'];

			focusableElement = Array.from(node.querySelectorAll('button')).find(
				(element) =>
					confirmLabels.some((label) => element.innerText.indexOf(label) !== -1)
			);
		}

		focusableElement.focus();

		return () => {
			node.removeEventListener('keydown', handleKeyDown);
		};
	}, [closeWithoutResult, closeWithResult]);

	return (
		// Even though the backdrop doesn't obscure the rest of the screen,
		// it prevents clicks outside until the modal is closed
		<div className="Modal__Backdrop">
			<div className="Modal" ref={modalRef} role="dialog">
				<h2 className="Modal__Heading">{modalTitle}</h2>
				{children}
				<div className="Modal__Footer">
					<button
						className="Modal__FooterButton--Cancel"
						onClick={closeWithoutResult}
					>
						Cancel
					</button>
					<button
						className="Modal__FooterButton--Confirm"
						onClick={closeWithResult}
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
