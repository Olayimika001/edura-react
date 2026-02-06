// ProductCard component - displays product summary
import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ title, price, children }) => {
  return (
    <article className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {price != null && <p className={styles.price}>{price}</p>}
      {children}
    </article>
  );
};

export default ProductCard;

