import { FaCheck } from 'react-icons/fa'; // FontAwesome Check icon
import styles from '../../styles/CustomCheckbox.module.css';

const CustomCheckbox = ({ completed, handleComplete, label }) => {
  return (
    <label className={styles.checkboxLabel} aria-label={`${label} checkbox`}>
      <input
        aria-label={`${label} input checkbox`}
        type="checkbox"
        checked={completed}
        onChange={handleComplete}
        className={styles.hiddenCheckbox}
      />
      <span
        className={styles.customCheckbox}
        style={{
          backgroundColor: completed ? `#9ab0ff` : ``,
        }}
      >
        {completed && <FaCheck className={styles.checkboxIcon} />}
      </span>
    </label>
  );
};

export default CustomCheckbox;
