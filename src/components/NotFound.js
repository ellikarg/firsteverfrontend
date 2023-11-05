import React from 'react';
import NoResults from '../assets/no_results.PNG';
import styles from '../styles/NotFound.module.css';
import Asset from './Assets';

const NotFound = () => {
  return (
    <div className={styles.Margin}>
        <Asset src={NoResults} message="Sorry, the page you're looking for doesn't exist" />
    </div>
  )
}

export default NotFound