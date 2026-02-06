// BlogDetails component - full blog post view
import React from 'react';
import styles from './BlogDetails.module.css';

const BlogDetails = ({ children }) => {
  return <article className={styles.details}>{children}</article>;
};

export default BlogDetails;

