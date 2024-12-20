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

// const styles = {
//   container: {
//     width: '100%',
//     position: 'relative',
//   },
//   dropdownOption: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px 16px',
//     backgroundColor: '#f9f9f9',
//     border: '1px solid #e0e0e0',
//     borderRadius: '8px',
//     cursor: 'pointer',
//   },
//   dropdownFieldText: {
//     fontSize: '16px',
//     fontWeight: 'normal',
//     color: '#555',
//   },
//   dropdownIcon: {
//     fontSize: '16px',
//     color: '#888',
//   },
//   dropdownMenu: {
//     marginTop: '8px', // Pushes the dropdown slightly below the button
//     backgroundColor: '#fff',
//     border: '1px solid #e0e0e0',
//     borderRadius: '8px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     padding: '8px',
//     overflow: 'hidden',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '4px',
//   },
//   absoluteMenu: {
//     width: '100%',
//     position: 'absolute',
//     boxSizing: 'border-box',
//     zIndex: '5',
//   },
//   dropdownItem: {
//     textAlign: 'left',
//     padding: '12px 8px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     color: '#333',
//     backgroundColor: '#fff',
//     borderRadius: '4px',
//   },
//   selectedOption: {
//     backgroundColor: 'whitesmoke', // Highlight selected option
//     fontWeight: 'bold',
//   },
// };
