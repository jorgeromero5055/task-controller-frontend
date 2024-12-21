const emailResetErrorMessage = {
  'auth/wrong-password':
    'The password you entered is incorrect. Please try again.',
  'auth/user-not-found':
    'No account found for this email. Please check your email and try again.',
  'auth/email-already-in-use':
    'This email address is already associated with another account.',
  'auth/invalid-email':
    'The email address you entered is invalid. Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/requires-recent-login':
    'You need to log in again to update your email address.',
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/internal-error':
    'An unexpected error occurred. Please try again later.',
};

export const getEmailResetErrorMessage = (code) =>
  emailResetErrorMessage[code] || 'An error occurred. Please try again.';

const passwordResetErrorMessage = {
  'auth/wrong-password':
    'The current password you entered is incorrect. Please try again.',
  'auth/requires-recent-login':
    'You need to log in again to update your password for security reasons.',
  'auth/weak-password':
    'The new password is too weak. Please use a stronger password.',
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/internal-error':
    'An unexpected error occurred. Please try again later.',
};

export const getPasswordResetErrorMessage = (code) =>
  passwordResetErrorMessage[code] ||
  'An error occurred while updating the password. Please try again.';

const deletionErrorMessage = {
  'auth/wrong-password':
    'The password you entered is incorrect. Please try again.',
  'auth/requires-recent-login':
    'Your session has expired. Please log in again to delete your account.',
  'auth/user-not-found':
    'The account does not exist or has already been deleted.',
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/internal-error':
    'An unexpected error occurred while attempting to delete the account. Please try again later.',
  'auth/too-many-requests':
    'Too many attempts. Please wait a while and try again.',
};

export const getDeletionErrorMessage = (code) =>
  deletionErrorMessage[code] ||
  'An error occurred while attempting to delete your account. Please try again.';

const logoutErrorMessage = {
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/requires-recent-login':
    'Your session has expired. Please log in again to continue.',
  'auth/internal-error':
    'An unexpected error occurred while logging out. Please try again later.',
  'auth/user-token-expired':
    'Your session has expired. Please log in again to log out securely.',
  'auth/too-many-requests':
    'Too many logout attempts. Please wait a while and try again.',
};

export const getLogoutErrorMessage = (code) =>
  logoutErrorMessage[code] ||
  'An error occurred while logging out. Please try again.';

export const signInErrorMessageHandler = (code) => {
  const errorMessages = {
    // Invalid email format
    'auth/invalid-email':
      'The email address is invalid. Please check and try again.',

    // Account not found
    'auth/user-not-found':
      'No account found with this email. Please sign up first.',

    // Incorrect password
    'auth/wrong-password': 'The password is incorrect. Please try again.',

    // Too many failed attempts
    'auth/too-many-requests':
      'Too many failed attempts. Please try again later.',

    // Network-related errors
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',

    // Internal error (general fallback)
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',
  };

  // Return the relevant error message or a default one
  return (
    errorMessages[code] ||
    'An unexpected error occurred. Please check your credentials and try again.'
  );
};

export const signUpErrorMessageHandler = (code) => {
  const errorMessages = {
    // Email is already in use
    'auth/email-already-in-use':
      'This email is already registered. Please log in or reset your password.',

    // Invalid email format
    'auth/invalid-email':
      'The email address is invalid. Please check and try again.',

    // Weak password
    'auth/weak-password':
      'The password is too weak. Please use at least 6 characters.',

    // Too many failed attempts
    'auth/too-many-requests': 'Too many attempts. Please try again later.',

    // Network-related errors
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',

    // Internal error (general fallback)
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',
  };

  // Return the relevant error message or a default one
  return (
    errorMessages[code] ||
    'An unexpected error occurred. Please check your information and try again.'
  );
};

export const resetPasswordErrorHandler = (code) => {
  const errorMessages = {
    // Email does not exist in Firebase
    'auth/user-not-found':
      'No account found with this email. Please check your email address.',

    // Invalid email format
    'auth/invalid-email':
      'The email address is invalid. Please enter a valid email.',

    // Too many requests to reset the password
    'auth/too-many-requests':
      'Too many password reset requests. Please try again later.',

    // Network-related issues
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',

    // General internal error
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',
  };

  // Return a user-friendly message or a generic fallback message
  return (
    errorMessages[code] ||
    'An error occurred while trying to reset your password. Please try again later.'
  );
};

export const sendPasswordResetErrorHandler = (code) => {
  const errorMessages = {
    // Email not found in Firebase
    'auth/user-not-found':
      'No account is associated with this email. Please check and try again.',

    // Invalid email format
    'auth/invalid-email':
      'The email format is invalid. Please enter a valid email address.',

    // Too many requests sent to Firebase
    'auth/too-many-requests':
      'Too many password reset requests. Please wait and try again later.',

    // Network-related issues
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',

    // Internal error
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',
  };

  // Return a user-friendly message or a generic fallback message
  return (
    errorMessages[code] ||
    'An error occurred while trying to send the password reset email. Please try again later.'
  );
};

export const updatePasswordErrorHandler = (code) => {
  const errorMessages = {
    // Weak password
    'auth/weak-password':
      'The new password is too weak. Please use a stronger password with at least 6 characters.',

    // Requires reauthentication (session expired or sensitive operation)
    'auth/requires-recent-login':
      'Your session has expired. Please log in again to update your password.',

    // Network-related error
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',

    // Internal error (catch-all for unexpected issues)
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',
  };

  // Return the relevant error message or a generic fallback message
  return (
    errorMessages[code] ||
    'An error occurred while trying to update your password. Please try again later.'
  );
};

export const actionCodeErrorHandler = (code) => {
  const errorMessages = {
    // Common errors for both methods
    'auth/invalid-action-code':
      'The link is invalid or has already been used. Please request a new one.',
    'auth/expired-action-code':
      'The link has expired. Please request a new one to continue.',
    'auth/network-request-failed':
      'A network error occurred. Please check your connection and try again.',
    'auth/internal-error':
      'An unexpected error occurred. Please try again later.',

    // Specific error for disabled users
    'auth/user-disabled':
      'This account has been disabled. Please contact support for assistance.',
  };

  return (
    errorMessages[code] ||
    'An error occurred while processing your request. Please try again later.'
  );
};

const reauthenticateAndUpdatePasswordErrorMessages = {
  // Errors specific to reauthentication
  'auth/wrong-password':
    'The password you entered is incorrect. Please try again.',
  'auth/user-mismatch':
    'The credentials do not match the authenticated user. Please try again.',
  'auth/user-not-found':
    'No account found with the provided credentials. Please check and try again.',
  'auth/requires-recent-login':
    'Your session has expired. Please log in again to continue.',
  'auth/network-request-failed':
    'A network error occurred. Please check your connection and try again.',
  'auth/internal-error':
    'An unexpected error occurred during reauthentication. Please try again later.',

  // Errors specific to password update
  'auth/weak-password':
    'The new password is too weak. Please use a stronger password with at least 6 characters.',
  'auth/invalid-credential':
    'The credentials provided are invalid. Please try again.',
};

export const getReauthenticateAndUpdatePasswordErrorMessage = (code) =>
  reauthenticateAndUpdatePasswordErrorMessages[code] ||
  'An error occurred. Please try again.';
