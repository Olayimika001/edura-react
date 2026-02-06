// EventCard component - displays event summary
import React from 'react';
import styles from './EventCard.module.css';

const EventCard = ({ title, date, children }) => {
  return (
    <article className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {date && <p className={styles.date}>{date}</p>}
      {children}
    </article>
  );
};

export default EventCard;

