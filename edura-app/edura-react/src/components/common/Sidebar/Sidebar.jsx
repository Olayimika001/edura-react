// Sidebar component - reusable sidebar layout for pages
import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ children }) => {
  return <aside className={styles.sidebar}>{children}</aside>;
};

export default Sidebar;

