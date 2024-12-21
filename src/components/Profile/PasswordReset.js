import { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { getReauthenticateAndUpdatePasswordErrorMessage } from '../../utils/errMessage';
import ProfileOptions from '../Reusable/ProfileOptions';

const ResetPassword = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPssword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      window.location.href = '/login?success=passwordReset';
    } catch (err) {
      const userFriendlyMessage =
        getReauthenticateAndUpdatePasswordErrorMessage(err.code);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileOptions
      options={{
        buttonText: 'Reset Password',
        submitHandler: submitHandler,
        error: error,
        loading: loading,
        field1: {
          type: 'password',
          placeholder: 'Enter your current password',
          title: 'Current Password',
          value: currentPassword,
          setValue: setCurrentPassword,
          prevPassword: true,
        },
        field2: {
          type: 'password',
          placeholder: 'Enter your new password',
          title: 'New Password',
          value: newPassword,
          setValue: setNewPassword,
        },
        field3: {
          type: 'password',
          placeholder: 'Confirm your new password',
          title: 'Confirm Password',
          value: confirmPassword,
          setValue: setConfirmPssword,
        },
      }}
    />
  );
};

export default ResetPassword;
