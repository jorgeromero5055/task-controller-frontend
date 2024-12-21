import React from 'react';
import styles from '../styles/NotFound.module.css'; // Import the CSS Module
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Sorry, we couldn't find this page.</p>
        <span
          onClick={() => {
            navigate('/');
          }}
          className={styles.button}
        >
          Back to home
        </span>
      </div>
    </div>
  );
};

export default NotFound;
