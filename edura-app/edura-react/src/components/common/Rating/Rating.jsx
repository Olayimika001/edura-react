// Rating component - displays a star rating
import React from 'react';
import styles from './Rating.module.css';

const Rating = ({ value = 0, max = 5 }) => {
  const filled = Math.max(0, Math.min(max, Math.round(value)));
  return (
    <div className={styles.rating} aria-label={`Rating ${filled} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < filled ? styles.filled : styles.empty}>
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;

