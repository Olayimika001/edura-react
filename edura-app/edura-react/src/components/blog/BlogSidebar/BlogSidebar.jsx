// BlogSidebar component - sidebar widgets for blog pages
import React from 'react';
import styles from './BlogSidebar.module.css';

const BlogSidebar = ({ children }) => {
  return <aside className={styles.sidebar}>{children}</aside>;
};

export default BlogSidebar;

