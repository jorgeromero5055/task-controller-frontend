import { useEffect, useRef, useState } from 'react';
import { useTaskContext } from '../../contexts/TaskContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // FontAwesome Check icon
import { isBeforeDay } from '../../utils/helpers';
import CustomCheckbox from '../Reusable/CustomCheckbox';
import { IoEllipsisVertical } from 'react-icons/io5';
import { IoMdTrash } from 'react-icons/io';
import styles from '../../styles/TaskList.module.css';
import { colors } from '../../utils/Constants';
import ErrorField from '../Reusable/ErrorField';

const TaskList = ({
  list,
  type,
  setSelectedItem,
  selectedItem,
  showCompleted,
  setShowCompleted,
  paginateButton,
  paginateLoad,
}) => {
  const { editTask, deleteTask, shownItems, isTouch } = useTaskContext();

  const [isOpen, setIsOpen] = useState(true); // Toggle visibility
  const [toggle, setToggle] = useState(null);
  const [error, setError] = useState({
    id: null,
    message: null,
  });

  const toggleVisibility = () => {
    setIsOpen((prev) => !prev);
  };

  const handleComplete = async (task) => {
    if (error) {
      setError({
        id: null,
        message: null,
      });
    }
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        overdue: !task.date
          ? false
          : task.completed && isBeforeDay(new Date(task.date), new Date())
          ? true
          : false,
      };
      await editTask(updatedTask);
      if (task.id === selectedItem?.id) {
        setSelectedItem({ ...updatedTask });
      }
    } catch (error) {
      setError({ id: task.id, message: error.message + ' please try again' });
    }
  };

  const handleDelete = async (id) => {
    if (error) {
      setError({
        id: null,
        message: null,
      });
    }
    try {
      await deleteTask(id);
      if (id === selectedItem?.id) {
        setSelectedItem(null);
      }
      setToggle(null);
    } catch (error) {
      setError({ id: id, message: error.message + ' please try again' });
    }
  };

  const optionBlurHandler = (e) => {
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
      return;
    }
    setToggle(null);
  };
  const [activeSwipe, setActiveSwipe] = useState({ id: null, left: 0 }); // Track only the active item's ID and position

  const handleTouchStart = (e, id) => {
    const startX = e.touches[0].clientX; // Capture starting touch position

    setActiveSwipe((prev) => ({
      id, // Set the currently active item
      startX, // Record the starting touch position
      left: prev.id === id ? prev.left || 0 : 0, // Preserve offset if the same item, or reset
    }));
  };

  const handleTouchMove = (e, id) => {
    if (activeSwipe.id !== id) return; // Only allow movement for the active item

    const currentX = e.touches[0].clientX; // Get current touch position
    const deltaX = currentX - activeSwipe.startX; // Calculate swipe distance in pixels
    const maxLeft = 5 * 16; // Max distance in pixels for right (5rem * 16px/rem)
    const maxRight = -5 * 16; // Max distance in pixels for left (-5rem * 16px/rem)

    // Calculate the new position based on previous left and deltaX
    let newLeft = activeSwipe.left + deltaX;

    if (activeSwipe.left === 0 && newLeft > 0) return;
    // Clamp the newLeft to the defined range
    newLeft = Math.max(maxRight, Math.min(maxLeft, newLeft));

    setActiveSwipe((prev) => ({
      ...prev,
      left: newLeft, // Update the left position
      startX: currentX, // Update startX to continue tracking relative movement
    }));
  };

  const handleTouchEnd = (e, id) => {
    if (activeSwipe.id !== id) return; // Only process for the active item
    const maxDistance = 5 * 16; // Max movement in pixels (5rem)
    const snapLeft = activeSwipe.left < -maxDistance / 2 ? -maxDistance : 0; // Snap to -5rem or 0
    setActiveSwipe((prev) => ({
      ...prev,
      id, // Retain the id of the last swiped item
      left: snapLeft, // Update the position after snapping
    }));
  };

  const observerRef = useRef(null);
  const lastItemRef = useRef(null);

  useEffect(() => {
    if (showCompleted) {
      //always run this
      if (observerRef.current) {
        if (lastItemRef.current) {
          observerRef.current.unobserve(lastItemRef.current);
        }
        observerRef.current.disconnect();
      }

      if (paginateLoad) {
        // only create this if a new load is needed
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setShowCompleted((prev) => prev + 5);
              }
            });
          },
          {
            root: null, // Observe relative to viewport
            threshold: 1.0, // Fully visible
          }
        );

        // Observe the new last item
        if (lastItemRef.current) {
          observerRef.current.observe(lastItemRef.current);
        }
      }
      // Cleanup on unmount
      return () => {
        if (observerRef.current) {
          if (lastItemRef.current) {
            observerRef.current.unobserve(lastItemRef.current);
          }
          observerRef.current.disconnect();
        }
      };
    }
  }, [list, setShowCompleted]);

  return (
    <>
      <div className={styles.header} onClick={toggleVisibility}>
        {/* Dropdown Icon */}
        <span className={styles.icon}>
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </span>

        {/* Title and Count */}
        <span className={styles.type}>
          {type}
          <span className={styles.count}>{list.length}</span>
        </span>
      </div>
      {isOpen && (
        <ul className={styles.taskList}>
          {list.length > 0 ? (
            list.map((task, index) => (
              <div key={task.id}>
                <div
                  className={styles.itemHolder}
                  ref={
                    paginateLoad && index === list.length - 1
                      ? lastItemRef
                      : null
                  }
                >
                  <div className={styles.optionParent}>
                    <div
                      className={styles.optionChild}
                      tabIndex={0}
                      onBlur={optionBlurHandler}
                    >
                      {!isTouch && (
                        <div
                          aria-label={`${
                            !task.name ? 'No Title' : task.name
                          } options`}
                          onClick={() => {
                            setToggle((prev) =>
                              prev === task.id ? null : task.id
                            );
                          }}
                          className={styles['ellipsis-icon']}
                          style={
                            toggle === task.id ? { visibility: 'visible' } : {}
                          }
                        >
                          <IoEllipsisVertical />
                        </div>
                      )}

                      {toggle === task.id && (
                        <div className={styles.optionsContainer}>
                          <div
                            className={styles.option}
                            onClick={() => {
                              handleDelete(task.id);
                            }}
                            aria-label={`${
                              !task.name ? 'No Title' : task.name
                            } delete item`}
                          >
                            <p className={styles.optionText}>Delete Item</p>
                            <IoMdTrash className={styles.optionRemoveIcon} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <li
                    aria-label={`${
                      !task.name ? 'No Title' : task.name
                    } list item`}
                    className={styles['list-item']}
                    style={{
                      ...(task.id === selectedItem?.id
                        ? { border: `2px solid ${colors.secondary} ` }
                        : {}),
                    }}
                    onClick={() => {
                      setSelectedItem(task);
                    }}
                    onTouchStart={(e) => {
                      isTouch && handleTouchStart(e, task.id);
                    }}
                    onTouchMove={(e) => {
                      isTouch && handleTouchMove(e, task.id);
                    }}
                    onTouchEnd={(e) => {
                      isTouch && handleTouchEnd(e, task.id);
                    }}
                  >
                    <div
                      className={styles['list-content']}
                      style={{
                        left:
                          task.id === activeSwipe.id
                            ? `${activeSwipe.left / 16}rem`
                            : '0rem', // Use swipe offset for the active item
                        transition: 'left 0.3s ease', // Smooth snapping transition
                      }}
                    >
                      <div className={styles.taskRow}>
                        {/* Checkbox and Name */}

                        <div className={styles.nameRow}>
                          <div
                            className={styles.checkboxContainer}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <CustomCheckbox
                              label={`${
                                !task.name ? 'No Title' : task.name
                              } item`}
                              completed={task.completed}
                              handleComplete={() => {
                                handleComplete(task);
                              }}
                            />
                          </div>
                          <p
                            className={styles.taskName}
                            style={{
                              color:
                                !task.name || task.completed ? '#888' : '#000',
                            }}
                          >
                            {!task.name ? 'No Title' : task.name}
                          </p>
                        </div>

                        {/* Date */}
                        <p
                          className={styles.taskDate}
                          style={{
                            color:
                              !task.date || task.completed ? '#888' : '#000',
                          }}
                        >
                          {!task.date ? 'No Date' : task.date}
                        </p>
                      </div>

                      <div className={styles.bottomRow}>
                        {/* Description */}
                        {shownItems.description && (
                          <p
                            className={styles.taskDescription}
                            style={{
                              color: task.completed ? '#888' : '#000',
                            }}
                          >
                            {task.description}
                          </p>
                        )}
                        {/* Priority */}
                        {shownItems.priority && (
                          <p
                            className={styles.taskPriority}
                            style={{
                              color: task.completed ? '#888' : '#000',
                            }}
                          >
                            {task.priority} Priority
                          </p>
                        )}
                      </div>
                      <button className={styles.deleteButton}>
                        <IoMdTrash className={styles.deleteIcon} />
                      </button>
                    </div>
                  </li>
                </div>
                {error.message && error.id === task.id && (
                  <div className={styles.errorContainer}>
                    <ErrorField error={error.message} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyListItem}>
              <p>No {type} Items In This View</p>
            </div>
          )}
          {paginateButton && (
            <button
              className={styles.showMoreButton}
              onClick={() => {
                setShowCompleted((prev) => (prev += 5));
              }}
            >
              Show more
            </button>
          )}
        </ul>
      )}
    </>
  );
};

export default TaskList;
