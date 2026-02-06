// FormGroup component - label + control wrapper
import React from 'react';
import styles from './FormGroup.module.css';

const FormGroup = ({ label, children, hint, error }) => {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.control}>{children}</div>
      {hint && !error && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default FormGroup;

