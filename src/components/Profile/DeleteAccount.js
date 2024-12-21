import { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { useMutation } from '@apollo/client';
import { DELETE_USER } from '../../utils/graphQl/users';
import { getDeletionErrorMessage } from '../../utils/errMessage';
import ProfileOptions from '../Reusable/ProfileOptions';

const DeleteAccount = ({ user }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [removeUser] = useMutation(DELETE_USER);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      // Reauthenticate the user with their password
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete the user account
      await deleteUser(user);
      // delete the user and their data from the db
      await removeUser();

      window.location.href = '/signup'; // Redirect to homepage or login page
    } catch (err) {
      const userFriendlyMessage = getDeletionErrorMessage(err.code);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileOptions
      options={{
        buttonText: 'Delete Account',
        submitHandler: handleDelete,
        error: error,
        loading: loading,
        field1: {
          type: 'password',
          placeholder: 'Enter your current password',
          title: 'Current Password',
          value: password,
          setValue: setPassword,
          prevPassword: true,
        },
      }}
    />
  );
};

export default DeleteAccount;
