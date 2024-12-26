import React, { useState } from 'react';
import {
  isSameDay,
  daysInMonth,
  formatSingleDateObject,
} from '../../utils/helpers';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import styles from '../../styles/ItemCalendar.module.css';

import { LuCalendar } from 'react-icons/lu';

const ItemCalendar = ({
  itemDate,
  selectionHandler,
  toggle,
  setToggle,
  backgroundColor,
}) => {
  const [selectedDates, setSelectedDates] = useState(
    itemDate ? new Date(itemDate) : null
  );
  const [currentMonth, setCurrentMonth] = useState(
    itemDate ? new Date(itemDate) : new Date()
  );

  const handleDateClick = (date) => {
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    }
    setSelectedDates(date);
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction
    );
    setCurrentMonth(newMonth);
  };

  const isSelected = (date) => {
    if (selectedDates && isSameDay(selectedDates, date)) {
      return 'select';
    } else {
      return '';
    }
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = new Date(year, month, 1).getDay();
    const prevMonthDays = daysInMonth(year, month - 1);

    const days = [];
    // Add previous month's days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      const returnClass = isSelected(date);
      days.push(
        <div
          aria-label={`${date.toDateString()}`}
          key={`prev-${i}`}
          className={`${styles.day} ${styles['adjacent-month']} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {date.getDate()}
          </div>
        </div>
      );
    }

    // Add current month's days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const returnClass = isSelected(date);

      days.push(
        <div
          aria-label={`${date.toDateString()}`}
          key={day}
          className={`${styles.day} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {day}
          </div>
        </div>
      );
    }

    // Add next month's days
    const remainingDays = 42 - days.length; // Ensure there are always 42 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const returnClass = isSelected(date);

      days.push(
        <div
          aria-label={`${date.toDateString()}`}
          key={`next-${i}`}
          className={`${styles.day} ${styles['adjacent-month']} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {date.getDate()}
          </div>
        </div>
      );
    }
    return days;
  };

  const toggleHandler = () => {
    setToggle((prev) => (prev === 'calendar' ? null : 'calendar'));
  };

  const clearHandler = () => {
    setSelectedDates(null);
    selectionHandler('');
    setToggle(null);
  };

  const setHandler = () => {
    selectionHandler(selectedDates);
    setToggle(null);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.dropdownOption}
        onClick={toggleHandler}
        aria-label="due date"
      >
        <div className={styles.dropdownFieldText}>
          {itemDate
            ? formatSingleDateObject(new Date(itemDate))
            : 'Select a date'}
        </div>
        <LuCalendar className={styles.calendarIcon} />
      </div>
      {toggle === 'calendar' && (
        <div
          className={styles.dateRangePicker}
          style={{ backgroundColor: `${backgroundColor}` }}
        >
          <div className={styles.header}>
            <button
              className={styles.arrowButton}
              onClick={() => handleMonthChange(-1)}
              type="button"
            >
              <FaChevronLeft className={styles.arrowIcon} />
            </button>
            <div>
              {currentMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              className={styles.arrowButton}
              onClick={() => handleMonthChange(1)}
              type="button"
            >
              <FaChevronRight className={styles.arrowIcon} />
            </button>
          </div>
          <div className={styles.calendarGrid}>{renderDays()}</div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.optionButton}
              onClick={clearHandler}
            >
              Clear
            </button>
            <button
              type="button"
              className={styles.optionButton}
              onClick={setHandler}
            >
              Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCalendar;
