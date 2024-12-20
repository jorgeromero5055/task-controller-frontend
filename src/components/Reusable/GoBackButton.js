import { IoMdArrowRoundBack } from 'react-icons/io';
import styles from '../../styles/GoBackButton.module.css';

const GoBackButton = ({ options }) => {
  return (
    <div className={styles.backToLogin}>
      <button
        type="button"
        onClick={() => {
          options.goBack();
        }}
        className={styles.linkButton}
      >
        <span className={styles.backIcon}>
          <IoMdArrowRoundBack />
        </span>
        {options.text}
      </button>
    </div>
  );
};

export default GoBackButton;
