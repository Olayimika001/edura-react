// Breadcrumb component - shows current navigation path
import React from 'react';
import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className={styles.item}>
            {item.href ? (
              <a className={styles.link} href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

