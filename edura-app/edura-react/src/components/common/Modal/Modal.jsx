// Modal component - basic modal overlay
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={() => onClose?.()}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Modal'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button type="button" className={styles.close} onClick={() => onClose?.()}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

