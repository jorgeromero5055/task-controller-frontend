import { useTaskContext } from '../../contexts/TaskContext';
import { useMemo, useState } from 'react';
import { isInRange, isSameDay, isSameOrBeforeDay } from '../../utils/helpers';
import TaskList from './TaskList';
import styles from '../../styles/TaskList.module.css';
import ErrorField from '../Reusable/ErrorField';

const priorityOrder = {
  'No Priority': 0,
  'Low Priority': 1,
  'Moderate Priority': 2,
  'High Priority': 3,
};

const sortDate = (list, direction) => {
  return [...list].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    else if (!a.date) return direction === 'Ascending' ? 1 : -1;
    else if (!a.date && !b.date) return direction === 'Ascending' ? -1 : 1;

    return direction === 'Ascending'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });
};

const sortPriority = (list, direction) => {
  return [...list].sort((a, b) => {
    return direction === 'Ascending'
      ? priorityOrder[a.priority] - priorityOrder[b.priority]
      : priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const sortName = (list, direction) => {
  return [...list].sort((a, b) => {
    if (direction === 'Ascending') {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    } else {
      return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    }
  });
};

const TaskContainer = ({ selectedItem, setSelectedItem, searchQuery }) => {
  const { tasks, loadingState, listDate, sortOptions, shownItems } =
    useTaskContext();

  const [showCompleted, setShowCompleted] = useState(5);
  const normalFilterList = useMemo(() => {
    const { from, to } = listDate.custom;

    if (to) {
      return tasks.filter(
        (task) =>
          (listDate.allTime
            ? listDate.allTime
            : !task.date
            ? true
            : isInRange(new Date(task.date), from, to)) &&
          !task.completed &&
          !task.overdue
      );
    } else {
      return tasks.filter(
        (task) =>
          (listDate.allTime
            ? listDate.allTime
            : !task.date
            ? true
            : isSameDay(new Date(task.date), from)) &&
          !task.completed &&
          !task.overdue
      );
    }
  }, [tasks, listDate]);

  const normalSortedList = useMemo(() => {
    if (sortOptions.field === 'Date') {
      return sortDate(normalFilterList, sortOptions.order);
    } else if (sortOptions.field === 'Priority') {
      return sortPriority(normalFilterList, sortOptions.order);
    } else if (sortOptions.field === 'Alphabetical') {
      return sortName(normalFilterList, sortOptions.order);
    }
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions]);

  const searchNormalList = useMemo(() => {
    return normalSortedList.filter(
      (task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions, searchQuery]);

  const completedFilterList = useMemo(() => {
    if (shownItems.completed) {
      const { from, to } = listDate.custom;
      if (to) {
        return tasks.filter(
          (task) =>
            (listDate.allTime
              ? listDate.allTime
              : !task.date
              ? true
              : isInRange(new Date(task.date), from, to)) && task.completed
        );
      } else {
        return tasks.filter(
          (task) =>
            (listDate.allTime
              ? listDate.allTime
              : !task.date
              ? true
              : isSameDay(new Date(task.date), from)) && task.completed
        );
      }
    } else return [];
  }, [tasks, listDate, shownItems.completed]);

  const completedSortedList = useMemo(() => {
    if (shownItems.completed) {
      if (sortOptions.field === 'Date') {
        return sortDate(completedFilterList, sortOptions.order);
      } else if (sortOptions.field === 'Priority') {
        return sortPriority(completedFilterList, sortOptions.order);
      } else if (sortOptions.field === 'Alphabetical') {
        return sortName(completedFilterList, sortOptions.order);
      }
    } else return [];
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions, shownItems.completed]);

  const searchCompletedList = useMemo(() => {
    if (shownItems.completed) {
      return completedSortedList.filter(
        (task) =>
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else return [];
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions, searchQuery, shownItems.completed]);

  const overdueFilterList = useMemo(() => {
    const { from, to } = listDate.custom;
    if (shownItems.overdue) {
      if (to) {
        return tasks.filter(
          (task) =>
            (listDate.allTime
              ? listDate.allTime
              : !task.date
              ? true
              : isSameOrBeforeDay(new Date(task.date), to)) && task.overdue
        );
      } else {
        return tasks.filter(
          (task) =>
            (listDate.allTime
              ? listDate.allTime
              : !task.date
              ? true
              : isSameOrBeforeDay(new Date(task.date), from)) && task.overdue
        );
      }
    } else return [];
  }, [tasks, listDate, shownItems.overdue]);

  const overdueSortedList = useMemo(() => {
    if (shownItems.overdue) {
      if (sortOptions.field === 'Date') {
        return sortDate(overdueFilterList, sortOptions.order);
      } else if (sortOptions.field === 'Priority') {
        return sortPriority(overdueFilterList, sortOptions.order);
      } else if (sortOptions.field === 'Alphabetical') {
        return sortName(overdueFilterList, sortOptions.order);
      }
    } else return [];
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions, shownItems.overdue]);

  const searchOverdueList = useMemo(() => {
    if (shownItems.overdue) {
      return overdueSortedList.filter(
        (task) =>
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else return [];
    // eslint-disable-next-line
  }, [tasks, listDate, sortOptions, searchQuery, shownItems.overdue]);

  if (loadingState === 'loading')
    return (
      <div className={styles.stateContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  if (loadingState === 'error')
    return (
      <div className={styles.stateContainer}>
        <ErrorField error={loadingState.error.message} />
      </div>
    );

  return (
    <div>
      <div
        className={
          !shownItems.overdue && !shownItems.completed
            ? styles.bottomContainer
            : styles.topContainer
        }
      >
        <TaskList
          list={searchNormalList}
          type="Upcoming"
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
        />
      </div>
      {shownItems.overdue && (
        <div
          className={
            !shownItems.completed ? styles.bottomContainer : styles.container
          }
        >
          <TaskList
            list={searchOverdueList}
            type="Overdue"
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </div>
      )}
      {shownItems.completed && (
        <div className={styles.bottomContainer}>
          <TaskList
            list={
              searchCompletedList.length > showCompleted
                ? searchCompletedList.slice(0, showCompleted)
                : searchCompletedList
            }
            type="Completed"
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            paginateButton={
              searchCompletedList.length > 5 && showCompleted === 5
            }
            paginateLoad={
              searchCompletedList.length > 5 &&
              showCompleted > 5 &&
              showCompleted < searchCompletedList.length
            }
          />
        </div>
      )}
    </div>
  );
};

export default TaskContainer;
