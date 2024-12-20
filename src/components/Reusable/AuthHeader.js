import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Adjust the path based on your file structure
import styles from '../../styles/AuthHeader.module.css';

const AuthHeader = ({ options }) => {
  return (
    <div className={styles.container}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <h2 className={styles.title}>{options.title}</h2>

      <p className={styles.subtext}>
        {options?.success && (
          <FaRegCheckCircle className={styles.successIcon} />
        )}
        {options?.error && <FaRegTimesCircle className={styles.errorIcon} />}
        {options?.success
          ? options.success
          : options?.error
          ? options.error
          : options.text}
      </p>
    </div>
  );
};

export default AuthHeader;
