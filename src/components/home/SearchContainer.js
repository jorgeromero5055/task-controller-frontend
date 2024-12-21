import FilterList from '../filter/FIilterPicker';
import { FaSearch, FaTimes, FaFilter, FaPlus } from 'react-icons/fa';
import styles from '../../styles/SearchContiainer.module.css';

const SearchContainer = ({
  searchQuery,
  setSearchQuery,
  visibleSection,
  setVisibleSection,
}) => {
  const blurHandler = (e) => {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    } else {
      setVisibleSection(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.container}>
      {/* Search Bar Container */}
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
          style={{ width: '100%', textOVverflow: 'ellipsis' }}
        />
        {searchQuery && (
          <FaTimes className={styles.clearIcon} onClick={clearSearch} />
        )}
      </div>
      {/* Button Container */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.iconButton}
          onClick={() => {
            setVisibleSection('form');
          }}
        >
          <FaPlus className={styles.addIconInsideButton} />
        </button>
        <div tabIndex={0} onBlur={blurHandler} style={{ position: 'relative' }}>
          <button
            className={styles.iconButton}
            name="filter"
            onClick={() => {
              setVisibleSection('filter');
            }}
          >
            <FaFilter className={styles.filterIconInsideButton} />
          </button>
          {visibleSection === 'filter' && (
            <div className={styles.filterList}>
              <FilterList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
