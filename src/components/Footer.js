import React from 'react';
import styles from '../styles/Footer.module.css';


// Footer that sticks at the bottom all pages
const Footer = () => {
  return (
    <div className={`${styles.FooterContainer}`}>
        <div className={styles.FooterContent}>© 2023 Copyright: Elisabeth Karg</div>
    </div>
  )
}

export default Footer