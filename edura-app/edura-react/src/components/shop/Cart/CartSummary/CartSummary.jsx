// CartSummary component - totals and checkout summary
import React from 'react';
import styles from './CartSummary.module.css';

const CartSummary = ({ children }) => {
  return <aside className={styles.summary}>{children}</aside>;
};

export default CartSummary;

