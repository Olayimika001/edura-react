// EventList component - list/grid of events
import React from 'react';
import styles from './EventList.module.css';

const EventList = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};

export default EventList;

