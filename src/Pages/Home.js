import TaskContainer from '../components/home/TaskContainer';
import Navbar from '../components/Navbar/Navbar';
import TaskItem from '../components/home/TaskItem';
import TaskForm from '../components/Navbar/CreateForm';
import { useState, useRef } from 'react';
import Profile from '../components/Navbar/Profile';
import SearchContainer from '../components/home/SearchContainer';
import styles from '../styles/Home.module.css'; // Updated to import CSS module
import { CiFolderOn } from 'react-icons/ci';
import { useTaskContext } from '../contexts/TaskContext';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSection, setVisibleSection] = useState(''); // Tracks the current visible section
  const handleVisibility = (section) => {
    setVisibleSection((prevSection) =>
      prevSection === section ? null : section
    );
  };
  const { windowSize } = useTaskContext();

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const handleDrag = (e) => {
    const newWidth = window.innerWidth - e.clientX; // Calculate new width for the right panel
    const clampedWidthPercent = Math.max(
      30,
      Math.min((newWidth / window.innerWidth) * 100, 50)
    );

    if (leftPanelRef.current) {
      leftPanelRef.current.style.width = `${100 - clampedWidthPercent}%`;
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.style.width = `${clampedWidthPercent}%`;
    }

    console.log(
      'clampedWidthPercent',
      100 - clampedWidthPercent,
      clampedWidthPercent
    );
  };

  const handleMouseDown = (e) => {
    if (window.innerWidth > 1024) {
      e.preventDefault();
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleDrag);
      });
    }
  };

  return (
    <>
      <div
        className={styles.container}
        style={{
          position: 'fixed',
        }}
      >
        <Navbar
          visibleSection={visibleSection}
          setVisibleSection={handleVisibility}
        />
        <div className={styles.taskContainer}>
          <div
            className={`${styles.taskList} ${
              selectedItem ? styles.itemVisible : ''
            }`}
            style={{ height: `${windowSize.height - 80}px` }}
            ref={leftPanelRef}
          >
            <div className={styles.searchBar}>
              <SearchContainer
                visibleSection={visibleSection}
                setVisibleSection={handleVisibility}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <div
              className={`${styles.scrollableList} ${styles.scrollable}`}
              style={{
                paddingRight: '1.5rem',
                ...(visibleSection === 'form' || visibleSection === 'profile'
                  ? { overflow: 'hidden' }
                  : {}),
              }}
            >
              <TaskContainer
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Resizer */}
          <div className={styles.resizer} onMouseDown={handleMouseDown} />

          {/* Right Panel */}
          <div
            className={`${styles.taskItem} ${
              selectedItem ? styles.itemVisible : ''
            }`}
            style={{ height: `${windowSize.height - 80}px` }}
            ref={rightPanelRef}
          >
            {selectedItem ? (
              <TaskItem
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                visibleSection={visibleSection}
              />
            ) : (
              <div className={styles.emptyStyle}>
                <p className={styles.emptyText}>View items here</p>
                <CiFolderOn className={styles.backgroundIcon} />
              </div>
            )}
          </div>
        </div>
      </div>
      {visibleSection === 'form' && (
        <TaskForm setVisibleSection={handleVisibility} />
      )}
      {visibleSection === 'profile' && (
        <Profile setVisibleSection={handleVisibility} />
      )}
    </>
  );
};

export default Home;
