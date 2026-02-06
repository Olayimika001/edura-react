// Button component - shared button with theme styles
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', ...props }) => {
  const className = `${styles.button} ${styles[variant] || ''}`.trim();
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;

