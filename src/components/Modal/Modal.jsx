import React, { useEffect } from 'react';
import css from './Modal.module.css';

const Modal = ({ largeImageURL, closeModal }) => {
  useEffect(() => {
    const onKeydownCloseModal = event => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeydownCloseModal);
    return () => window.removeEventListener('keydown', onKeydownCloseModal);
  });

  const onClickCloseModal = event => {
    if (event.currentTarget === event.target) {
      closeModal();
    }
  };

  return (
    <div className={css.Overlay} onClick={onClickCloseModal}>
      <div className={css.Modal}>
        <div className={css.ModalImageContainer}>
          <img className={css.ModalImage} src={largeImageURL} alt="Art" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
