import { IoIosAdd, IoMdTrash } from 'react-icons/io';
import CustomCheckbox from './CustomCheckbox';
import styles from '../../styles/TodoFiled.module.css';

const ToDoField = ({ subTasks, handleSubTasks, style }) => {
  const updateSubTasks = (payload) => {
    let newSubtasks;
    switch (payload.type) {
      case 'addItem': {
        newSubtasks = [payload.newData, ...subTasks];
        break;
      }
      case 'updateText': {
        newSubtasks = subTasks.map((item) =>
          item.id === payload.id ? { ...item, text: payload.updatedText } : item
        );
        break;
      }
      case 'updateCheck': {
        if (payload.item.checked) {
          newSubtasks = subTasks.map((item) =>
            item.id === payload.item.id
              ? { ...item, checked: !item.checked }
              : item
          );
          const checkedItems = newSubtasks.filter((item) => item.checked);
          const uncheckedItems = newSubtasks.filter((item) => !item.checked);
          uncheckedItems.sort((a, b) => new Date(b.id) - new Date(a.id));
          newSubtasks = [...uncheckedItems, ...checkedItems];
        } else {
          newSubtasks = subTasks.filter((item) => item.id !== payload.item.id);
          newSubtasks.push({ ...payload.item, checked: !payload.item.checked });
        }
        break;
      }
      case 'deleteItem': {
        newSubtasks = subTasks.filter((item) => item.id !== payload.id);
        break;
      }
      default: {
        throw new Error(`Unknown action type: ${payload.type}`);
      }
    }

    handleSubTasks(newSubtasks);
  };

  return (
    <div>
      <div
        className={styles.header}
        style={{
          marginBottom: subTasks.length > 0 ? '20px' : '0px',
        }}
      >
        <label htmlFor="Subtask">Subtask</label>
        <IoIosAdd
          aria-label="add subtask"
          className={styles.addIcon}
          onClick={() =>
            updateSubTasks({
              type: 'addItem',
              newData: {
                id: new Date().toISOString(),
                text: '',
                checked: false,
              },
            })
          }
        />
      </div>
      {subTasks.length > 0 && (
        <>
          <ul className={styles.list}>
            {subTasks.map((item, index) => (
              <li
                key={item.id}
                className={styles.listItem}
                style={{
                  marginBottom:
                    subTasks.length === 1 || subTasks.length - 1 === index
                      ? '0rem'
                      : '1.5rem',
                }}
                aria-label={`subtask item ${index + 1}`}
              >
                <div className={styles.checkboxContainer}>
                  <CustomCheckbox
                    label={`subtask ${index + 1}`}
                    completed={item.checked}
                    handleComplete={() => {
                      updateSubTasks({ type: 'updateCheck', item: item });
                    }}
                  />
                </div>
                <input
                  aria-label={`subtask ${index + 1} input`}
                  type="text"
                  value={item.text}
                  onChange={(e) =>
                    updateSubTasks({
                      type: 'updateText',
                      id: item.id,
                      updatedText: e.target.value,
                    })
                  }
                  className={styles.input}
                  style={{
                    ...(item.checked
                      ? {
                          color: '#dbdbdb',
                          borderBottom: '2px solid #e8e8e8',
                        }
                      : {}),
                  }}
                />
                <IoMdTrash
                  aria-label={`subtask ${index + 1} delete button`}
                  onClick={() =>
                    updateSubTasks({ type: 'deleteItem', id: item.id })
                  }
                  className={styles.deleteButton}
                />
              </li>
            ))}
          </ul>
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default ToDoField;
