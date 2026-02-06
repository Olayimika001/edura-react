// InstructorCard component - displays an instructor summary
import React from 'react';
import styles from './InstructorCard.module.css';

const InstructorCard = ({ name, title, avatar, children }) => {
  return (
    <article className={styles.card}>
      {avatar && <img className={styles.avatar} src={avatar} alt={name} />}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {title && <p className={styles.title}>{title}</p>}
        {children}
      </div>
    </article>
  );
};

export default InstructorCard;

