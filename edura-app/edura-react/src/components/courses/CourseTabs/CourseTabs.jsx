// CourseTabs component - tab navigation for course details
import React from 'react';
import styles from './CourseTabs.module.css';

const CourseTabs = ({ tabs = [], activeId, onChange }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.tab} ${t.id === activeId ? styles.active : ''}`.trim()}
          onClick={() => onChange?.(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default CourseTabs;

