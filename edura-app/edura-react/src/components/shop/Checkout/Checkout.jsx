// Checkout component - checkout flow container
import React from 'react';
import styles from './Checkout.module.css';

const Checkout = ({ children }) => {
  return <section className={styles.checkout}>{children}</section>;
};

export default Checkout;

