import ResetEmail from '../Profile/EmailReset';
import ResetPassword from '../Profile/PasswordReset';
import DeleteAccount from '../Profile/DeleteAccount';
import { useState } from 'react';
import { getLogoutErrorMessage } from '../../utils/errMessage';
import { getAuth } from 'firebase/auth';
import { IoIosMail, IoMdTrash, IoIosAdd } from 'react-icons/io';
import { FaKey } from 'react-icons/fa6';
import { BsFillPersonFill, BsExclamationCircle } from 'react-icons/bs';
import { FaChevronRight } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import GoBackButton from '../Reusable/GoBackButton';
import styles from '../../styles/Profile.module.css';

const subTextOptions = {
  email: 'Enter your current password to proceed',
  password: 'Password must be at least 6 characters long',
  delete: 'This event cannot be undone and all your data will be deleted',
};

const Profile = ({ setVisibleSection }) => {
  const [toggle, setToggle] = useState('menu');
  const [logoutError, setLogoutError] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const titleOptions = {
    menu: user?.email,
    email: 'Change Your Email',
    password: 'Reset Your Password',
    delete: 'Delete Your Account',
  };

  if (!user) {
    return <p>no user</p>;
  }

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      const friendlyMessage = getLogoutErrorMessage(error.code);
      setLogoutError(friendlyMessage);
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      className={`${styles.overlay} ${styles.scrollable}`}
      // style={{
      //   height: `${window.innerHeight}px`,
      // }}
    >
      <div className={`${styles.modal} ${styles.scrollable}`}>
        <IoIosAdd
          className={styles.exitIcon}
          onClick={() => {
            setVisibleSection('profile');
          }}
        />
        <div className={styles.icon}>
          {toggle === 'menu' && <BsFillPersonFill />}
          {toggle === 'email' && <IoIosMail />}
          {toggle === 'password' && <FaKey />}
          {toggle === 'delete' && <IoMdTrash />}
        </div>

        {/* Title */}
        <h2 className={styles.title}>{titleOptions[toggle]}</h2>
        {toggle != 'menu' && (
          <p className={styles.subtext}>{subTextOptions[toggle]}</p>
        )}
        {toggle === 'menu' && (
          <div className={styles.container}>
            {/* Divider above the first row */}
            <div className={styles.dividerContianer}>
              <div className={styles.divider}></div>
            </div>

            {/* Row items */}
            <div
              className={styles.row}
              onClick={() => {
                setToggle('email');
              }}
            >
              <div className={styles.rowItem}>
                <IoIosMail className={styles.emailIcon} />
                <span>Change Email</span>
              </div>
              <FaChevronRight />
            </div>

            <div
              className={styles.row}
              onClick={() => {
                setToggle('password');
              }}
            >
              <div className={styles.rowItem}>
                <FaKey />
                <span>Reset Password</span>
              </div>
              <FaChevronRight />
            </div>

            <div
              className={styles.row}
              onClick={() => {
                setToggle('delete');
              }}
            >
              <div className={styles.rowItem}>
                <IoMdTrash className={styles.deleteIcon} />
                <span>Delete Account</span>
              </div>
              <FaChevronRight />
            </div>

            {/* Divider above Log out */}
            <div className={styles.dividerContianer}>
              <div className={styles.divider}></div>
            </div>

            {/* Log out */}
            <div className={styles.row} onClick={handleLogout}>
              <div className={`${styles.rowItem} ${styles.bottomRow}`}>
                <FaSignOutAlt />
                <span>Log out</span>
              </div>
              <span>{/* Icon placeholder */}</span>
            </div>
            {logoutError && (
              <div className={styles.errorContainer}>
                <BsExclamationCircle className={styles.errorIcon} />
                <span className={styles.errorText}>
                  {logoutError}
                  {logoutError.includes('try') &&
                    !logoutError.includes('later') && (
                      <span
                        className={styles.logoutLink}
                        onClick={handleLogout}
                      >
                        Logout
                      </span>
                    )}
                </span>
              </div>
            )}
          </div>
        )}
        {toggle === 'email' && <ResetEmail user={user} />}
        {toggle === 'password' && <ResetPassword user={user} />}
        {toggle === 'delete' && <DeleteAccount user={user} />}
        {toggle != 'menu' && (
          <GoBackButton
            options={{
              text: 'Go Back',
              goBack: () => {
                setToggle('menu');
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
