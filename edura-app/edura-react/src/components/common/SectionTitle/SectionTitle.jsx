// SectionTitle component - reusable section heading block
import React from 'react';
import styles from './SectionTitle.module.css';

const SectionTitle = ({ title, subtitle, align = 'left' }) => {
  return (
    <div className={`${styles.sectionTitle} ${styles[align] || ''}`.trim()}>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {title && <h2 className={styles.title}>{title}</h2>}
    </div>
  );
};

export default SectionTitle;

