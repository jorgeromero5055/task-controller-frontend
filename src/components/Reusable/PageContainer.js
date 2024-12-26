import React from 'react';
import styles from '../../styles/PageContainer.module.css'; // Import the CSS Module

const PageContainer = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
};

export default PageContainer;
