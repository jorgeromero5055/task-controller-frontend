import React, { useState } from 'react';
import CustomDropdown from '../Reusable/CustomDropdown';
import { useTaskContext } from '../../contexts/TaskContext';
import { FaChevronLeft } from 'react-icons/fa';
import FilterCalendar from './FIlterCalendar';
import { dateOptions } from '../../utils/Constants';
import styles from '../../styles/DateFilter.module.css';

const DateFilter = ({ setOpenFilter }) => {
  const { setListDate, listDate } = useTaskContext();
  const [toggle, setToggle] = useState(null);
  const [dateOption, setDateOption] = useState(
    listDate.allTime ? 'All Time' : 'Custom'
  );

  const dateHandler = (value) => {
    setDateOption(value);
    setListDate((prev) => ({
      ...prev,
      allTime: value === 'All Time' ? true : false,
    }));
  };

  const selectionHandler = (selectedDates) => {
    setListDate((prev) => ({ ...prev, custom: selectedDates }));
    setOpenFilter('main');
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
        <p className={styles.sortByTitle}>Date</p>
      </div>
      <CustomDropdown
        options={dateOptions}
        selectedOption={dateOption}
        setSelectedOption={dateHandler}
        toggle={toggle}
        setToggle={setToggle}
      />
      {dateOption === 'Custom' && (
        <FilterCalendar
          selectionHandler={selectionHandler}
          listDate={listDate}
        />
      )}
    </div>
  );
};

export default DateFilter;
