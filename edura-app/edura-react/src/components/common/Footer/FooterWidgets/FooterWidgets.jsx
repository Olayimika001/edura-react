// FooterWidgets component - groups footer widget sections
import React from 'react';
import styles from './FooterWidgets.module.css';

const FooterWidgets = ({ children }) => {
  return <div className={styles.widgets}>{children}</div>;
};

export default FooterWidgets;

