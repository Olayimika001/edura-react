// Price component - formats and displays a price
import React from 'react';
import styles from './Price.module.css';

const Price = ({ value, currency = 'USD' }) => {
  const formatted =
    typeof value === 'number'
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)
      : value ?? '';

  return <span className={styles.price}>{formatted}</span>;
};

export default Price;

