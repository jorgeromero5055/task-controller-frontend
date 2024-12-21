import styles from '../../styles/AuthContainer.module.css';

const AuthContainer = ({ children }) => {
  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authPageSubContainer}>{children}</div>
    </div>
  );
};

export default AuthContainer;
