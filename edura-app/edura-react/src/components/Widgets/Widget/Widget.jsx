// Widget component - shared widget wrapper (sidebar/footer widgets)
import React from 'react';
import styles from './Widget.module.css';

const Widget = ({ title, children }) => {
  return (
    <section className={styles.widget}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default Widget;

