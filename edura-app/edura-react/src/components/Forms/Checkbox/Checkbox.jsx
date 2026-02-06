// Checkbox component - shared checkbox input
import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({ label, ...props }) => {
  return (
    <label className={styles.label}>
      <input className={styles.input} type="checkbox" {...props} />
      <span className={styles.text}>{label}</span>
    </label>
  );
};

export default Checkbox;

