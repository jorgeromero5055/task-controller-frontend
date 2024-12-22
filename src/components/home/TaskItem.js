import { useTaskContext } from '../../contexts/TaskContext';
import { useEffect, useRef, useState } from 'react';
import { isBeforeDay } from '../../utils/helpers';
import ToDoField from '../Reusable/TodoListField';
import CustomCheckbox from '../Reusable/CustomCheckbox';
import CustomDropdown from '../Reusable/CustomDropdown';
import ItemCalendar from '../Reusable/ItemCalendar';
import { IoIosAdd, IoMdTrash } from 'react-icons/io';
import { IoEllipsisVertical } from 'react-icons/io5';
import styles from '../../styles/TaskItem.module.css';
import ErrorField from '../Reusable/ErrorField';
import { prioritySelectionList } from '../../utils/Constants';
// const options = ['none', 'Low', 'Medium', 'Top'];

const TaskItem = ({ selectedItem, setSelectedItem, visibleSection }) => {
  const { editTask, deleteTask, windowSize } = useTaskContext();
  const [error, setError] = useState(false);

  const handleChnage = async (e) => {
    if (error) {
      setError(false);
    }
    let newItem;
    const { id, value } = e.target;
    if (id === 'date') {
      newItem = {
        ...selectedItem,
        [id]: !value ? value : value.toLocaleDateString(),
        overdue: !value
          ? false
          : !selectedItem.completed && isBeforeDay(new Date(value), new Date()),
      };
    } else if (id === 'completed') {
      newItem = {
        ...selectedItem,
        [id]: !selectedItem.completed,
        overdue: !selectedItem.date
          ? false
          : !selectedItem.completed &&
            isBeforeDay(new Date(selectedItem.date), new Date()),
      };
    } else {
      newItem = {
        ...selectedItem,
        [id]: value,
      };
    }
    try {
      await editTask(newItem);
      setSelectedItem(newItem);
    } catch (error) {
      setError(error.message + ' please try again');
    }
  };

  const deleteHandler = async () => {
    if (error) {
      setError(false);
    }
    try {
      await deleteTask(selectedItem.id);
      setSelectedItem(null);
    } catch (error) {
      setError(error.message + ' please try again');
    }
  };

  const dateSetHandler = (date) => {
    handleChnage({ target: { id: 'date', value: date } });
  };

  const prioritySetHandler = (prio) => {
    handleChnage({ target: { id: 'priority', value: prio } });
  };

  const handleSubTasks = (newSubtasks) => {
    handleChnage({ target: { id: 'subtasks', value: newSubtasks } });
  };

  const handleComplete = () => {
    handleChnage({ target: { id: 'completed' } });
  };

  const [toggle, setToggle] = useState(null);

  const itemOptions = useRef(null);
  const priorityOptions = useRef(null);
  const dateOptions = useRef(null);

  const blurHandler = (e) => {
    const relatedTarget = e.relatedTarget;
    if (
      (itemOptions.current && itemOptions.current.contains(relatedTarget)) ||
      (priorityOptions.current &&
        priorityOptions.current.contains(relatedTarget)) ||
      (dateOptions.current && dateOptions.current.contains(relatedTarget))
    ) {
      return;
    }
    setToggle(null);
  };

  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width < 590 && !isNarrow) {
          setIsNarrow(true);
        } else if (width >= 590 && isNarrow) {
          setIsNarrow(false);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line
        observer.unobserve(containerRef.current);
      }
    };
  }, [isNarrow]);

  return (
    <div className={styles.itemContainer} style={{ height: '100%' }}>
      {error && (
        <div className={styles.errorContainer}>
          {<ErrorField error={error} />}
        </div>
      )}
      <div className={styles.headerContainer}>
        <div
          aria-label={`${
            selectedItem?.name ? selectedItem.name : 'no title'
          } close item`}
        >
          <IoIosAdd
            className={styles.exitIcon}
            onClick={() => {
              setSelectedItem(null);
            }}
          />
        </div>
        <div
          className={styles.optionsParent}
          ref={itemOptions}
          tabIndex={0}
          onBlur={blurHandler}
        >
          <div
            aria-label={`${
              selectedItem?.name ? selectedItem.name : 'no title'
            } options`}
            onClick={() => {
              setToggle((prev) => (prev === 'options' ? null : 'options'));
            }}
          >
            <IoEllipsisVertical className={styles.ellipsisIcon} />
          </div>
          {toggle === 'options' && (
            <div className={styles.optionsContainer}>
              <div
                aria-label={`${
                  selectedItem?.name ? selectedItem.name : 'no title'
                } delete item`}
                className={styles.option}
                onClick={deleteHandler}
              >
                <p className={styles.optionText}>Delete Item</p>
                <IoMdTrash className={styles.optionRemoveIcon} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.topContainer} ${styles.scrollable}`}
        style={{
          ...(visibleSection === 'form' || visibleSection === 'profile'
            ? { overflow: 'hidden' }
            : {}),
          height: `${windowSize.height - 176}px`,
        }}
      >
        <div className={styles.nameContainer}>
          <div className={styles.checkboxContainer}>
            <CustomCheckbox
              label={`${
                selectedItem?.name ? selectedItem.name : 'no title'
              } item`}
              completed={selectedItem?.completed}
              handleComplete={handleComplete}
            />
          </div>
          <input
            aria-label="task name"
            id="name"
            type="text"
            value={selectedItem?.name}
            onChange={handleChnage}
            className={styles.nameInput}
            placeholder="What's on your mind"
          />
        </div>
        <div
          className={styles.rowDropdownContainer}
          style={{
            ...(isNarrow
              ? {
                  flexDirection: 'column',
                  gap: '2rem',
                  width: '100%',
                }
              : {}),
          }}
          ref={containerRef}
        >
          <div
            className={styles.fullWidth}
            tabIndex={0}
            onBlur={blurHandler}
            ref={priorityOptions}
          >
            <CustomDropdown
              options={prioritySelectionList}
              selectedOption={selectedItem.priority}
              setSelectedOption={prioritySetHandler}
              toggle={toggle}
              setToggle={setToggle}
              absoluteMenu={true}
            />
          </div>
          <div
            className={styles.fullWidth}
            tabIndex={0}
            onBlur={blurHandler}
            ref={dateOptions}
          >
            <ItemCalendar
              itemDate={selectedItem?.date}
              selectionHandler={dateSetHandler}
              toggle={toggle}
              setToggle={setToggle}
            />
          </div>
        </div>
        <textarea
          aria-label="description"
          id="description"
          className={styles.descriptionArea}
          type="text"
          value={selectedItem?.description}
          onChange={handleChnage}
          placeholder="Add a description"
        />
        <ToDoField
          subTasks={selectedItem.subtasks}
          handleSubTasks={handleSubTasks}
        />
      </div>
    </div>
  );
};

export default TaskItem;
