import React from 'react';
import styles from '../styles/Loading.module.css'; // Import the CSS Module

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default Loading;
