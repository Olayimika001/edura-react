// InstructorList component - list/grid of instructors
import React from 'react';
import styles from './InstructorList.module.css';

const InstructorList = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};

export default InstructorList;

