// BlogContent component - main rich content for a blog post
import React from 'react';
import styles from './BlogContent.module.css';

const BlogContent = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export default BlogContent;

