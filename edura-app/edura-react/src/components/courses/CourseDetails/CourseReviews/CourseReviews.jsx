// CourseReviews component - shows reviews for a course
import React from 'react';
import styles from './CourseReviews.module.css';

const CourseReviews = ({ children }) => {
  return <section className={styles.reviews}>{children}</section>;
};

export default CourseReviews;

