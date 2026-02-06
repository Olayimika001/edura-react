// BlogCard component - displays a blog summary card
import React from 'react';
import styles from './BlogCard.module.css';

const BlogCard = ({ title, excerpt, children }) => {
  return (
    <article className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      {children}
    </article>
  );
};

export default BlogCard;

