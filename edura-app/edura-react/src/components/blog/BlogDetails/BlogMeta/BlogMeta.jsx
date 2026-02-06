// BlogMeta component - author/date/categories info
import React from 'react';
import styles from './BlogMeta.module.css';

const BlogMeta = ({ children }) => {
  return <div className={styles.meta}>{children}</div>;
};

export default BlogMeta;

