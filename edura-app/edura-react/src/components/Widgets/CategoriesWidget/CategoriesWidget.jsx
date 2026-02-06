// CategoriesWidget component - shows category links
import React from 'react';
import styles from './CategoriesWidget.module.css';

const CategoriesWidget = ({ children }) => {
  return <div className={styles.categories}>{children}</div>;
};

export default CategoriesWidget;

