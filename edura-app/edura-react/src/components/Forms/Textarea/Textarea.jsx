// Textarea component - shared textarea
import React from 'react';
import styles from './Textarea.module.css';

const Textarea = (props) => {
  return <textarea className={styles.textarea} {...props} />;
};

export default Textarea;

