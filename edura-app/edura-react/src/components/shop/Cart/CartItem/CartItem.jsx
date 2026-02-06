// CartItem component - single item row in cart
import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ children }) => {
  return <div className={styles.item}>{children}</div>;
};

export default CartItem;

