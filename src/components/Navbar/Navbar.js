import logo from '../../assets/logo.png'; // Adjust the path based on your file structure
import { BsFillPersonFill } from 'react-icons/bs';
import styles from '../../styles/Navbar.module.css';

const Navbar = ({ setVisibleSection }) => {
  return (
    <div className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <p className={styles.logoText}>Task Controler</p>
      </div>
      <div
        className={styles.icon}
        onClick={() => {
          setVisibleSection('profile');
        }}
      >
        <BsFillPersonFill />
      </div>
    </div>
  );
};

export default Navbar;
