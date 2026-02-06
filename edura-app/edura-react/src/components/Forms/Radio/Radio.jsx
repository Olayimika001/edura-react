// Radio component - shared radio input
import React from 'react';
import styles from './Radio.module.css';

const Radio = ({ label, ...props }) => {
  return (
    <label className={styles.label}>
      <input className={styles.input} type="radio" {...props} />
      <span className={styles.text}>{label}</span>
    </label>
  );
};

export default Radio;

