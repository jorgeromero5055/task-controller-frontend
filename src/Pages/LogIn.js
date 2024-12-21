import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import AuthHeader from '../components/Reusable/AuthHeader';
import ProfileOptions from '../components/Reusable/ProfileOptions';
import AuthLink from '../components/Reusable/AuthLink';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInErrorMessageHandler } from '../utils/errMessage';
import AuthContainer from '../components/Reusable/AuthContainer';

const successString = {
  emailReset: 'Your email has been reset successfully. Please log in.',
  passwordReset: 'Your password has been reset successfully. Please log in.',
};

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const successMessage = queryParams.get('success');

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(signInErrorMessageHandler(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: 'Welcome Back',
          text: 'Enter your email and password to cotinue',
          success: successMessage
            ? successString[successMessage]
            : successMessage,
        }}
      />
      <ProfileOptions
        options={{
          buttonText: 'Log in',
          submitHandler: handleSubmit,
          error: error,
          loading: loading,
          field1: {
            type: 'email',
            placeholder: 'Enter your email',
            title: 'Email',
            value: email,
            setValue: setEmail,
          },
          field2: {
            type: 'password',
            placeholder: 'Enter your password',
            title: 'Password',
            value: password,
            setValue: setPassword,
            prevPassword: true,
          },
        }}
      />
      <AuthLink
        options={{
          text: "Don't have an account? ",
          linkText: 'Register',
          route: '/signup',
        }}
      />
    </AuthContainer>
  );
};

export default LogIn;
