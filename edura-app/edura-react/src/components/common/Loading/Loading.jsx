// Loading component - generic loading indicator
import React from 'react';
import styles from './Loading.module.css';

const Loading = ({ label = 'Loading…' }) => {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default Loading;

