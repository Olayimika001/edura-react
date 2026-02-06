// ContactForm component - contact form wrapper
import React from 'react';
import styles from './ContactForm.module.css';

const ContactForm = ({ children, onSubmit }) => {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
};

export default ContactForm;

