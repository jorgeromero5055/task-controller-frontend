import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../../styles/CustomDropdown.module.css';

const CustomDropdown = ({
  options,
  selectedOption,
  setSelectedOption,
  toggle,
  setToggle,
  absoluteMenu,
}) => {
  const toggleDropdown = () =>
    setToggle((prev) => (prev === 'dropdown' ? null : 'dropdown'));

  const handleSelect = (option) => {
    setSelectedOption(option);
    setToggle(null);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.dropdownOption}
        onClick={toggleDropdown}
        aria-label="priority"
      >
        <div className={styles.dropdownFieldText}>{selectedOption}</div>
        <FaChevronDown
          className={styles.dropdownIcon}
          style={{
            transform: toggle === 'dropdown' ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </div>
      {toggle === 'dropdown' && (
        <div
          className={`${styles.dropdownMenu} ${
            absoluteMenu ? styles.absoluteMenu : ''
          }`}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`${styles.dropdownItem} ${
                option === selectedOption ? styles.selectedOption : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
