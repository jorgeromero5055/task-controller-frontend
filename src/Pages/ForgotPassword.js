import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { sendPasswordResetErrorHandler } from '../utils/errMessage';
import AuthHeader from '../components/Reusable/AuthHeader';
import ProfileOptions from '../components/Reusable/ProfileOptions';
import AuthContainer from '../components/Reusable/AuthContainer';
import GoBackButton from '../components/Reusable/GoBackButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    setLoading(true);
    if (error) {
      setError('');
    }
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(sendPasswordResetErrorHandler(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: 'Forgot Password ?',
          text: 'Enter your email to await further instructions',
          success: success,
        }}
      />
      <ProfileOptions
        options={{
          buttonText: 'Send Instructions',
          submitHandler: handleSubmit,
          error: error,
          success: success,
          loading: loading,
          field1: {
            type: 'email',
            placeholder: 'Enter your email',
            title: 'Current Email',
            value: email,
            setValue: setEmail,
          },
        }}
      />
      <GoBackButton
        options={{
          text: 'Go to login',
          goBack: () => {
            window.location.href = '/login';
          },
        }}
      />
    </AuthContainer>
  );
};

export default ForgotPassword;
