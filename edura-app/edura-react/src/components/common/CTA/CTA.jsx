// CTA component - reusable call-to-action block
import React from 'react';
import styles from './CTA.module.css';

const CTA = ({ title, description, children }) => {
  return (
    <section className={styles.cta}>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
};

export default CTA;

