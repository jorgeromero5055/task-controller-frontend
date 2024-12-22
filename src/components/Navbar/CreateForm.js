import { useRef, useState } from 'react';
import { useTaskContext } from '../../contexts/TaskContext';
import { isBeforeDay } from '../../utils/helpers';
import ToDoField from '../Reusable/TodoListField';
import ItemCalendar from '../Reusable/ItemCalendar';
import CustomDropdown from '../Reusable/CustomDropdown';
import { IoIosAdd } from 'react-icons/io';
import styles from '../../styles/CreateFrom.module.css';
import ErrorField from '../Reusable/ErrorField';
import { prioritySelectionList } from '../../utils/Constants';

// const options = ['none', 'Low', 'Medium', 'Top'];

const TaskForm = ({ setVisibleSection }) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    priority: 'No Priority',
    subtasks: [],
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    if (error) {
      setError(false);
    }
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      setError(false);
    }
    try {
      await addTask({
        name: formData.name.trim() === '' ? '' : formData.name,
        description: formData.description,
        date: formData.date,
        completed: false,
        overdue: !formData.date
          ? false
          : isBeforeDay(new Date(formData.date), new Date()),
        priority: formData.priority,
        subtasks: formData.subtasks,
      });
      setFormData({
        name: '',
        description: '',
        date: '',
        priority: 'none',
        subtasks: [],
      });
      setVisibleSection('form');
    } catch (error) {
      setError(error.message + ' please try again');
    }
  };

  const cancelHandler = () => {
    if (error) {
      setError(false);
    }
    setFormData({
      name: '',
      description: '',
      date: '',
      priority: 'none',
      subtasks: [],
    });
    setVisibleSection('form');
  };

  const dateSetHandler = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: !date ? date : date.toLocaleDateString(),
    }));
  };

  const prioritySetHandler = (prio) => {
    setFormData((prev) => ({ ...prev, priority: prio }));
  };

  const handleSubTasks = (newSubtasks) => {
    setFormData((prev) => ({ ...prev, subtasks: newSubtasks }));
  };

  const [toggle, setToggle] = useState(null);

  const priorityOptions = useRef(null);
  const dateOptions = useRef(null);

  const blurHandler = (e) => {
    const relatedTarget = e.relatedTarget; // The element receiving focus

    if (
      (priorityOptions.current &&
        priorityOptions.current.contains(relatedTarget)) ||
      (dateOptions.current && dateOptions.current.contains(relatedTarget))
    ) {
      return; // Ignore blur event if focus is within the referenced element
    }
    setToggle(null);
  };

  return (
    <div
      className={`${styles.overlay} ${styles.scrollable}`}
      // style={{
      //   height: `${window.innerHeight}px`,
      // }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setVisibleSection('form');
        }
      }}
    >
      <form onSubmit={handleSubmit} className={styles.formModal}>
        <div className={styles.closeButtonContainer}>
          <IoIosAdd
            className={styles.exitIcon}
            onClick={() => {
              setVisibleSection('form');
            }}
          />
        </div>
        <div className={styles.topForm}>
          <div className={styles.fieldHolder}>
            <label htmlFor="name" className={styles.label}>
              Task Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className={styles.input}
              placeholder="What's on your mind"
            />
          </div>
          <div className={styles.fieldHolder}>
            <label htmlFor="priority" className={styles.label}>
              Priority
            </label>
            <div
              className={styles.fullWidth}
              tabIndex={0}
              onBlur={blurHandler}
              ref={priorityOptions}
            >
              <CustomDropdown
                options={prioritySelectionList}
                selectedOption={formData.priority}
                setSelectedOption={prioritySetHandler}
                toggle={toggle}
                setToggle={setToggle}
                absoluteMenu={true}
              />
            </div>
          </div>
          <div className={styles.fieldHolder}>
            <label htmlFor="due date" className={styles.label}>
              Due Date
            </label>
            <div
              className={styles.fullWidth}
              tabIndex={0}
              onBlur={blurHandler}
              ref={dateOptions}
            >
              <ItemCalendar
                key={toggle}
                itemDate={formData.date}
                selectionHandler={dateSetHandler}
                toggle={toggle}
                setToggle={setToggle}
              />
            </div>
          </div>

          <div className={styles.fieldHolder}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              className={styles.textarea}
              placeholder="Add a description"
            />
          </div>
          <ToDoField
            aria-label="subtasks"
            subTasks={formData.subtasks}
            handleSubTasks={handleSubTasks}
          />
          <div className={styles.buttonContainer}>
            <button
              aria-label="Clear All"
              type="button"
              onClick={cancelHandler}
              className={styles.formButton}
            >
              Cancel
            </button>
            <button
              aria-label="Set Date"
              type="submit"
              className={styles.formButton}
            >
              Create
            </button>
          </div>
          {error && <ErrorField error={error} />}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
