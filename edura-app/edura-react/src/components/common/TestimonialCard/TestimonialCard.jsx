// TestimonialCard component - displays a single testimonial
import React from 'react';
import styles from './TestimonialCard.module.css';

const TestimonialCard = ({ quote, name, role, avatar }) => {
  return (
    <article className={styles.card}>
      {avatar && <img className={styles.avatar} src={avatar} alt={name} />}
      <p className={styles.quote}>{quote}</p>
      <div className={styles.meta}>
        <h4 className={styles.name}>{name}</h4>
        {role && <span className={styles.role}>{role}</span>}
      </div>
    </article>
  );
};

export default TestimonialCard;

