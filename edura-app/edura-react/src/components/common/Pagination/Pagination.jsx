// Pagination component - page navigation controls
import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ page = 1, totalPages = 1, onChange }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        disabled={!canPrev}
        onClick={() => onChange?.(page - 1)}
      >
        Prev
      </button>
      <span className={styles.meta}>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className={styles.button}
        disabled={!canNext}
        onClick={() => onChange?.(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

