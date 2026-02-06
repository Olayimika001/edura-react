// InstructorDetails component - full instructor profile
import React from 'react';
import styles from './InstructorDetails.module.css';

const InstructorDetails = ({ children }) => {
  return <section className={styles.details}>{children}</section>;
};

export default InstructorDetails;

