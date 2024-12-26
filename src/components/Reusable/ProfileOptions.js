import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import styles from '../../styles/ProfileOptions.module.css';
import ErrorField from './ErrorField';

const validationMap = {
  email: (value) => {
    if (!value) return 'email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Please enter a valid email address.';
    return '';
  },
  password: (value) => {
    if (!value) return 'password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters long.';
    return '';
  },
};

const ProfileOptions = ({ options }) => {
  const [showField1Password, setShowField1Password] = useState(false);
  const [showField2Password, setShowField2Password] = useState(false);
  const [showField3Password, setShowField3Password] = useState(false);
  const [field1Error, setField1Error] = useState('');
  const [field2Error, setField2Error] = useState('');
  const [field3Error, setField3Error] = useState('');

  const field1ChangeHandler = (e) => {
    options.field1.setValue(e.target.value);
    if (!e.target.value) {
      setField1Error(`${options.field1.type} is required.`);
    } else if (field1Error) {
      setField1Error('');
    }
  };
  const field1BlurHandler = (event) => {
    const { relatedTarget } = event;
    if (
      event.currentTarget.parentElement?.contains(relatedTarget) ||
      relatedTarget?.closest('button')?.textContent?.trim() ===
        'Forgot password?' ||
      relatedTarget?.closest('button')?.textContent?.trim() === 'Go Back'
    )
      return;

    const validate = validationMap[options.field1.type](options.field1.value); // Get the validation function
    if (validate) {
      setField1Error(validate);
    }
  };

  const field2ChangeHandler = (e) => {
    options.field2.setValue(e.target.value);
    if (!e.target.value) {
      setField2Error(`${options.field2.type} is required.`);
    } else if (field2Error) {
      setField2Error('');
    }
  };

  const field2BlurHandler = (event) => {
    const { relatedTarget } = event;
    if (
      event.currentTarget.parentElement?.contains(relatedTarget) ||
      relatedTarget?.closest('button')?.textContent?.trim() ===
        'Forgot password?' ||
      relatedTarget?.closest('button')?.textContent?.trim() === 'Go Back'
    )
      return;

    if (
      options.field2.title === 'Confirm Password' &&
      options.field2.value !== options.field1.value
    ) {
      setField2Error('Passswords must match');
    } else {
      const validate = validationMap[options.field2.type](options.field2.value); // Get the validation function
      if (validate) {
        setField2Error(validate);
      }
    }
  };

  const field3ChangeHandler = (e) => {
    options.field3.setValue(e.target.value);
    if (!e.target.value) {
      setField3Error(`${options.field3.type} is required.`);
    } else if (field3Error) {
      setField3Error('');
    }
  };

  const field3BlurHandler = (event) => {
    const { relatedTarget } = event;
    if (
      event.currentTarget.parentElement?.contains(relatedTarget) ||
      relatedTarget?.closest('button')?.textContent?.trim() ===
        'Forgot password?' ||
      relatedTarget?.closest('button')?.textContent?.trim() === 'Go Back'
    )
      return;

    if (
      options.field3.title === 'Confirm Password' &&
      options.field3.value !== options.field2.value
    ) {
      setField3Error('Passswords must match');
    } else {
      const validate = validationMap[options.field2.type](options.field2.value); // Get the validation function

      if (validate) {
        setField3Error(validate);
      }
    }
  };

  return (
    <div className={styles.container}>
      {!options?.success && (
        <form
          className={styles.subcontainer}
          onSubmit={(e) => {
            e.preventDefault();

            if (
              !options.field1.value ||
              (options?.field2 && !options.field2.value) ||
              (options?.field3 && !options.field3.value)
            ) {
              if (!options.field1.value) {
                setField1Error(`${options.field1.type} is required.`);
              }
              if (options?.field2 && !options.field2.value) {
                setField2Error(`${options.field2.type} is required.`);
              }
              if (options?.field3 && !options.field3.value) {
                setField3Error(`${options.field3.type} is required.`);
              }
            } else {
              options.submitHandler();
            }
          }}
        >
          <label className={styles.label}>
            <span className={styles.labelText}>{options.field1.title}</span>
            <div className={styles.inputWrapper}>
              <input
                type={
                  showField1Password && options.field1.type === 'password'
                    ? 'text'
                    : options.field1.type
                }
                placeholder={options.field1.placeholder}
                className={styles.input}
                style={{ ...(field1Error ? { borderColor: '#f5c2c2' } : {}) }}
                value={options.field1.value}
                onChange={field1ChangeHandler}
                onBlur={field1BlurHandler}
              />
              {options.field1.type === 'password' && (
                <button
                  aria-label="toggle password visibility"
                  type="button"
                  onClick={() => setShowField1Password((prev) => !prev)}
                  className={styles.toggleButton}
                >
                  {showField1Password ? (
                    <IoMdEyeOff className={styles.iconSmall} />
                  ) : (
                    <IoMdEye className={styles.iconSmall} />
                  )}
                </button>
              )}
            </div>
            {options.field1?.prevPassword && (
              <div className={styles.forgotPasswordContainer}>
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      'http://localhost:3000/reset-password',
                      '_blank'
                    )
                  }
                  className={styles.forgotPasswordButton}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </label>
          {field1Error && (
            <div className={styles.fieldErrorContainer}>
              <ErrorField error={field1Error} />
            </div>
          )}
          {options?.field2 && (
            <label className={styles.label}>
              <span className={styles.labelText}>{options.field2.title}</span>
              <div className={styles.inputWrapper}>
                <input
                  type={
                    showField2Password && options.field2.type === 'password'
                      ? 'text'
                      : options.field2.type
                  }
                  placeholder={options.field2.placeholder}
                  className={styles.input}
                  style={{ ...(field2Error ? { borderColor: '#f5c2c2' } : {}) }}
                  value={options.field2.value}
                  onChange={field2ChangeHandler}
                  onBlur={field2BlurHandler}
                />
                {options.field2.type === 'password' && (
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    onClick={() => setShowField2Password((prev) => !prev)}
                    className={styles.toggleButton}
                  >
                    {showField2Password ? (
                      <IoMdEyeOff className={styles.iconSmall} />
                    ) : (
                      <IoMdEye className={styles.iconSmall} />
                    )}
                  </button>
                )}
              </div>

              {options.field2?.prevPassword && (
                <div className={styles.forgotPasswordContainer}>
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        'http://localhost:3000/forgot-password',
                        '_blank'
                      );
                    }}
                    className={styles.forgotPasswordButton}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </label>
          )}
          {field2Error && (
            <div className={styles.fieldErrorContainer}>
              <ErrorField error={field2Error} />
            </div>
          )}

          {options?.field3 && (
            <label className={styles.label}>
              <span className={styles.labelText}>{options.field3.title}</span>
              <div className={styles.inputWrapper}>
                <input
                  type={
                    showField3Password && options.field3.type === 'password'
                      ? 'text'
                      : options.field3.type
                  }
                  placeholder={options.field3.placeholder}
                  className={styles.input}
                  style={{ ...(field3Error ? { borderColor: '#f5c2c2' } : {}) }}
                  value={options.field3.value}
                  onChange={field3ChangeHandler}
                  onBlur={field3BlurHandler}
                />
                {options.field3.type === 'password' && (
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    onClick={() => setShowField3Password((prev) => !prev)}
                    className={styles.toggleButton}
                  >
                    {showField3Password ? (
                      <IoMdEyeOff className={styles.iconSmall} />
                    ) : (
                      <IoMdEye className={styles.iconSmall} />
                    )}
                  </button>
                )}
              </div>
              {options.field3?.prevPassword && (
                <div className={styles.forgotPasswordContainer}>
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        'http://localhost:3000/forgot-password',
                        '_blank'
                      );
                    }}
                    className={styles.forgotPasswordButton}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </label>
          )}
          {field3Error && (
            <div className={styles.fieldErrorContainer}>
              <ErrorField error={field3Error} />
            </div>
          )}

          {options.error && (
            <div className={styles.fieldErrorContainer}>
              <ErrorField error={options.error} />
            </div>
          )}
          <button
            disabled={field1Error || field2Error || field3Error}
            type="submit"
            className={styles.button}
          >
            {options.loading ? 'Loading ...' : options.buttonText}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileOptions;
