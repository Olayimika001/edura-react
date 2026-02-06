// Wishlist component - wishlist container
import React from 'react';
import styles from './Wishlist.module.css';

const Wishlist = ({ children }) => {
  return <section className={styles.wishlist}>{children}</section>;
};

export default Wishlist;

