// CourseFilter component - filters and sorting controls for courses list
import React from 'react';
import styles from './CourseFilter.module.css';

const CourseFilter = ({ children }) => {
  return <div className={styles.filter}>{children}</div>;
};

export default CourseFilter;

