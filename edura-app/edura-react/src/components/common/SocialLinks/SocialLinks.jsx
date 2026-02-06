// SocialLinks component - list of social profile links
import React from 'react';
import styles from './SocialLinks.module.css';

const SocialLinks = ({ links = [] }) => {
  return (
    <ul className={styles.list}>
      {links.map((l, idx) => (
        <li key={`${l.href}-${idx}`} className={styles.item}>
          <a className={styles.link} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;

