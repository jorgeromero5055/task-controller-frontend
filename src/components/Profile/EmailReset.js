import { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from 'firebase/auth';
import { getEmailResetErrorMessage } from '../../utils/errMessage';
import ProfileOptions from '../Reusable/ProfileOptions';

const ResetEmail = ({ user }) => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    setLoading(true);
    if (error) {
      setError('');
    }
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail);
      window.location.href = '/login?success=emailReset';
    } catch (err) {
      const userFriendlyMessage = getEmailResetErrorMessage(err.code);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileOptions
      options={{
        buttonText: 'Update Email',
        submitHandler: submitHandler,
        error: error,
        loading: loading,
        field1: {
          type: 'email',
          placeholder: 'Enter your new email',
          title: 'New Email',
          value: newEmail,
          setValue: setNewEmail,
        },
        field2: {
          type: 'password',
          placeholder: 'Enter your current password',
          title: 'Current Password',
          value: currentPassword,
          setValue: setCurrentPassword,
          prevPassword: true,
        },
      }}
    />
  );
};

export default ResetEmail;
