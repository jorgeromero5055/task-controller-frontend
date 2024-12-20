import styles from '../../styles/ErrorField.module.css';
import { BsExclamationCircle } from 'react-icons/bs';

const ErrorField = ({ error }) => {
  return (
    <div aria-label="error message" className={styles.errorContainer}>
      <BsExclamationCircle className={styles.errorIcon} />
      <p className={styles.errorText}>{error}</p>
    </div>
  );
};

export default ErrorField;
