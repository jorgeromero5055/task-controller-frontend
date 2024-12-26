import React, { useState } from 'react';
import CustomDropdown from '../Reusable/CustomDropdown';
import { useTaskContext } from '../../contexts/TaskContext';
import { FaSort, FaChevronLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { options } from '../../utils/Constants';
import styles from '../../styles/SortByFilter.module.css';

const SortFilter = ({ setOpenFilter }) => {
  const { sortOptions, setSortOptions } = useTaskContext();
  const [toggle, setToggle] = useState(null);
  const toggleSortOrder = () => {
    setSortOptions((prev) => ({
      ...prev,
      order: prev.order === 'Ascending' ? 'Descending' : 'Ascending',
    }));
  };

  const setSortFieldHandler = (option) => {
    setSortOptions((prev) => ({
      ...prev,
      field: option,
    }));
  };

  return (
    <div className={styles.sortByContainer}>
      <div
        className={styles.backOptionContainer}
        onClick={() => setOpenFilter('main')}
      >
        <button className={styles.backButton}>
          <FaChevronLeft className={styles.backIcon} />
        </button>
        <p className={styles.sortByTitle}>Sort by</p>
      </div>
      <CustomDropdown
        options={options}
        selectedOption={sortOptions.field}
        setSelectedOption={setSortFieldHandler}
        toggle={toggle}
        setToggle={setToggle}
      />
      <div className={styles.sortOption} onClick={toggleSortOrder}>
        <div className={styles.sortOrderText}>
          {sortOptions.order === 'Ascending' ? (
            <>
              <FaArrowUp className={styles.sortOrderIcon} />
              Ascending
            </>
          ) : (
            <>
              <FaArrowDown className={styles.sortOrderIcon} />
              Descending
            </>
          )}
        </div>
        <FaSort className={styles.dropdownSortIcon} />
      </div>
    </div>
  );
};

export default SortFilter;
