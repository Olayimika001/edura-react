// EventDetails component - full event view
import React from 'react';
import styles from './EventDetails.module.css';

const EventDetails = ({ children }) => {
  return <section className={styles.details}>{children}</section>;
};

export default EventDetails;

