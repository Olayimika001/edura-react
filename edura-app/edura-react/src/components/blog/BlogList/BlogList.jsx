// BlogList component - list/grid of blog cards
import React from 'react';
import styles from './BlogList.module.css';

const BlogList = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};

export default BlogList;

