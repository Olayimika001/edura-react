// Cart component - shopping cart page section
import React from 'react';
import styles from './Cart.module.css';

const Cart = ({ children }) => {
  return <section className={styles.cart}>{children}</section>;
};

export default Cart;

