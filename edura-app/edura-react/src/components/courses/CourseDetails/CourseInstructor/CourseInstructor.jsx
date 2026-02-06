// CourseInstructor component - shows instructor info for a course
import React from 'react';
import styles from './CourseInstructor.module.css';

const CourseInstructor = ({ name, title, avatar, bio }) => {
  return (
    <section className={styles.instructor}>
      {avatar && <img className={styles.avatar} src={avatar} alt={name} />}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {title && <p className={styles.title}>{title}</p>}
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
    </section>
  );
};

export default CourseInstructor;

