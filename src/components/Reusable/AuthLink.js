import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AuthLink.module.css';
const AuthLink = ({ options }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.authLinkContainer}>
      {options.text}
      <span
        className={styles.authLinkText}
        onClick={() => {
          navigate(options.route);
        }}
      >
        {options.linkText}
      </span>
    </div>
  );
};

export default AuthLink;
