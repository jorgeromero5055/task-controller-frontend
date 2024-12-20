import styles from '../../styles/AuthContainer.module.css';

const AuthContainer = ({ children }) => {
  return (
    <div
      className={styles.authPageContainer}
      // style={{ height: `${window.innerHeight}px`, backgroundColor: 'red' }}
      // style={{ height: '100dvh' }}
      // style={{ height: '100vh' }}
    >
      <div className={styles.authPageSubContainer}>{children}</div>
    </div>
  );
};

export default AuthContainer;
