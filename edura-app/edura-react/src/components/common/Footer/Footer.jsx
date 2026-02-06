// Footer component - Main footer with widgets and bottom section
import React from 'react';
import styles from './Footer.module.css';
import FooterWidgets from './FooterWidgets/FooterWidgets';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <FooterWidgets>
          {/* TODO: add actual footer widgets content */}
        </FooterWidgets>
      </div>
      <div className={styles.bottom}>
        {/* TODO: add footer bottom content (copyright, links, etc.) */}
      </div>
    </footer>
  );
};

export default Footer;

