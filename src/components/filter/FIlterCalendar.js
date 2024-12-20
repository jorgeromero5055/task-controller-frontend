import React, { useState } from 'react';
import {
  isSameDay,
  daysInMonth,
  formatMultiDateObject,
  formatSingleDateObject,
} from '../../utils/helpers';
import styles from '../../styles/FilterCalendar.module.css';

import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const FilterCalendar = ({ listDate, selectionHandler }) => {
  const [selectedDates, setSelectedDates] = useState(listDate.custom);
  const [currentMonth, setCurrentMonth] = useState(listDate.custom.from);

  const handleDateClick = (date) => {
    const { from, to } = selectedDates;
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth()));
    }
    if (!from || (from && to && date < from)) {
      setSelectedDates({ from: date, to: null });
    } else if (
      (from && isSameDay(date, from)) ||
      (from && to && isSameDay(date, from))
    ) {
      setSelectedDates({ from: null, to: null });
    } else if (from && to && isSameDay(date, to)) {
      setSelectedDates((prev) => ({ ...prev, to: null }));
    } else if (from && to && date > from) {
      setSelectedDates((prev) => ({ ...prev, to: date }));
    } else if (date < from) {
      setSelectedDates({ from: date, to: null });
    } else if (to && date > to) {
      setSelectedDates({ from, to: date });
    } else if (date > from && (!to || date < to)) {
      setSelectedDates({ from, to: date });
    }
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction
    );
    setCurrentMonth(newMonth);
  };

  const isSelected = (date, index) => {
    if (
      (selectedDates.from &&
        !selectedDates.to &&
        selectedDates.from.toDateString() === date.toDateString()) ||
      (selectedDates.from &&
        selectedDates.to &&
        date.toDateString() === selectedDates.from.toDateString() &&
        date.toDateString() === selectedDates.to.toDateString())
    ) {
      return 'select';
    } else if (
      selectedDates.from &&
      selectedDates.to &&
      date.toDateString() === selectedDates.from.toDateString()
    ) {
      if (index % 7 === 6) {
        return 'select';
      } else {
        return 'select-left';
      }
    } else if (
      selectedDates.from &&
      selectedDates.to &&
      date.toDateString() === selectedDates.to.toDateString()
    ) {
      if (index % 7 === 0) {
        return 'select';
      } else {
        return 'select-right';
      }
    } else if (
      selectedDates.from &&
      selectedDates.to &&
      date >= selectedDates.from &&
      date <= selectedDates.to
    ) {
      if (index % 7 === 0) {
        return 'in-range-left';
      } else if (index % 7 === 6) {
        return 'in-range-right';
      } else {
        return 'in-range-full';
      }
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
    let index = 0;
    // Add previous month's days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      const returnClass = isSelected(date, index);
      days.push(
        <div
          key={`prev-${i}`}
          className={`${styles.day} ${styles['adjacent-month']} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-left']} ${
              (returnClass.includes('select') &&
                returnClass.includes('right')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('right') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-right']} ${
              (returnClass.includes('select') &&
                returnClass.includes('left')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('left') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : returnClass.includes('range') && !returnClass.includes('full')
                ? styles['range-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {date.getDate()}
          </div>
        </div>
      );
      index++;
    }

    // Add current month's days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);

      const returnClass = isSelected(date, index);
      days.push(
        <div
          key={day}
          className={`${styles.day} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-left']} ${
              (returnClass.includes('select') &&
                returnClass.includes('right')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('right') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-right']} ${
              (returnClass.includes('select') &&
                returnClass.includes('left')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('left') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : returnClass.includes('range') && !returnClass.includes('full')
                ? styles['range-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {day}
          </div>
        </div>
      );
      index++;
    }

    // Add next month's days
    const remainingDays = 42 - days.length; // Ensure there are always 42 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const returnClass = isSelected(date, index);

      days.push(
        <div
          key={`next-${i}`}
          className={`${styles.day} ${styles['adjacent-month']} ${
            returnClass ? styles['select-text'] : ''
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div
            className={`${styles['nested-day-left']} ${
              (returnClass.includes('select') &&
                returnClass.includes('right')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('right') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-right']} ${
              (returnClass.includes('select') &&
                returnClass.includes('left')) ||
              (returnClass.includes('range') &&
                (returnClass.includes('left') || returnClass.includes('full')))
                ? styles['range-bg']
                : ''
            }`}
          ></div>
          <div
            className={`${styles['nested-day-middle']} ${
              returnClass.includes('select')
                ? styles['select-bg']
                : returnClass.includes('range') && !returnClass.includes('full')
                ? styles['range-bg']
                : isSameDay(date, new Date())
                ? styles['today-border']
                : ''
            }`}
          >
            {date.getDate()}
          </div>
        </div>
      );
      index++;
    }
    return days;
  };

  const clearHandler = () => {
    setSelectedDates({ from: null, to: null });
  };

  return (
    <div className={styles['date-range-picker']}>
      <div className={styles['date-text-container']}>
        <p className={styles['date-text']}>
          {selectedDates?.to
            ? formatMultiDateObject(selectedDates.from, selectedDates.to)
            : selectedDates?.from
            ? formatSingleDateObject(selectedDates.from)
            : 'Select a date'}
        </p>
      </div>
      <div className={styles.header}>
        <button
          className={styles['arrow-button']}
          onClick={() => handleMonthChange(-1)}
        >
          <FaChevronLeft className={styles['arrow-icon']} />
        </button>
        <div>
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <button
          className={styles['arrow-button']}
          onClick={() => handleMonthChange(1)}
        >
          <FaChevronRight className={styles['arrow-icon']} />
        </button>
      </div>
      <div className={styles['calendar-grid']}>{renderDays()}</div>
      <div className={styles['button-container']}>
        <button className={styles['option-button']} onClick={clearHandler}>
          Clear
        </button>
        <button
          className={styles['option-button']}
          disabled={!selectedDates.from}
          onClick={() => selectionHandler(selectedDates)}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default FilterCalendar;
