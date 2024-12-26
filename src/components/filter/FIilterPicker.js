import React, { useState } from 'react';
import { useTaskContext } from '../../contexts/TaskContext';
import { FaChevronRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import SortFilter from './SortByFilter';
import { LuArrowLeftRight, LuCalendar } from 'react-icons/lu';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import DateFilter from './DateFilter';
import {
  formatMultiDateObject,
  formatSingleDateObject,
} from '../../utils/helpers';
import styles from '../../styles/FilterPicker.module.css';
import {
  defaultSort,
  defaultFitlersObject,
  defaultFitlersArray,
  hideAllFitlersObject,
  hideAllFitlersArray,
} from '../../utils/Constants';

const ViewOptions = ({ filterModule, filterBlurHandler }) => {
  const { shownItems, setShownItems, sortOptions, setSortOptions, listDate } =
    useTaskContext();

  const [visibileItems, setVisibileItems] = useState([
    { id: 1, name: 'description', visible: shownItems.description },
    { id: 3, name: 'priority', visible: shownItems.priority },
    { id: 4, name: 'overdue', visible: shownItems.overdue },
    { id: 5, name: 'completed', visible: shownItems.completed },
  ]);

  const [openFilter, setOpenFilter] = useState('main');

  const toggleVisibility = (shownItem) => {
    setShownItems((prev) => ({
      ...prev,
      [shownItem.name]: !prev[shownItem.name],
    }));

    setVisibileItems((prevItems) =>
      prevItems.map((item) =>
        item.id === shownItem.id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const resetToDefault = () => {
    setVisibileItems(defaultFitlersArray);
    setShownItems(defaultFitlersObject);
    setSortOptions(defaultSort);
  };

  const hideAllHandler = () => {
    setVisibileItems(hideAllFitlersArray);
    setShownItems(hideAllFitlersObject);
  };

  const displayDate = () => {
    if (listDate.allTime) {
      return 'All Time';
    } else {
      const { from, to } = listDate.custom;
      if (to) {
        return formatMultiDateObject(from, to);
      } else {
        return formatSingleDateObject(from);
      }
    }
  };

  return (
    <div
      className={styles.relative}
      ref={filterModule}
      onBlur={filterBlurHandler}
      tabIndex={0}
    >
      <div
        className={`${styles.filterContainer} ${styles.scrollList}`}
        style={{
          width:
            window.innerWidth < 767
              ? `calc(${window.innerWidth}px - 3rem)`
              : '320px',

          maxHeight: `${window.innerHeight - 160}px`,
          overflow: 'auto',
        }}
      >
        {openFilter === 'main' && (
          <div className={styles.mainContainer}>
            <div className={styles.mainList}>
              <div className={styles.sortByButton} onClick={resetToDefault}>
                <div className={styles.sortByText}>
                  <span className={styles.defaultIcon}>
                    <BsArrowCounterclockwise />
                  </span>
                  Default View
                </div>
              </div>
              <div
                className={styles.sortByButton}
                onClick={() => {
                  setOpenFilter('sort');
                }}
              >
                <div className={styles.sortByText}>
                  <span className={styles.sortByIcon}>
                    <LuArrowLeftRight />
                  </span>
                  Sort by
                </div>
                <span className={styles.sortByField}>
                  {sortOptions.field}{' '}
                  <FaChevronRight className={styles.arrowIcon} />
                </span>
              </div>

              <div
                className={styles.sortByButton}
                onClick={() => {
                  setOpenFilter('date');
                }}
              >
                <div className={styles.sortByText}>
                  <span className={styles.calendarIcon}>
                    <LuCalendar />
                  </span>
                  Date
                </div>
                <span className={styles.sortByField}>
                  {displayDate()}
                  <FaChevronRight className={styles.arrowIcon} />
                </span>
              </div>
              <div className={styles.section}>
                <div className={styles.shownHeader}>
                  <p className={styles.shownTitle}>Shown</p>
                  <button
                    className={styles.hideAllButton}
                    onClick={hideAllHandler}
                  >
                    Hide All
                  </button>
                </div>
                {visibileItems.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <span className={styles.listItemName}>{item.name}</span>
                    <button
                      className={styles.visibilityToggle}
                      onClick={() => toggleVisibility(item)}
                    >
                      {item.visible ? (
                        <FaEye className={styles.eyeIconVisible} />
                      ) : (
                        <FaEyeSlash className={styles.eyeIconHidden} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {openFilter === 'sort' && <SortFilter setOpenFilter={setOpenFilter} />}
        {openFilter === 'date' && <DateFilter setOpenFilter={setOpenFilter} />}
      </div>
    </div>
  );
};

export default ViewOptions;
