import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import AuthHeader from '../components/Reusable/AuthHeader';
import ProfileOptions from '../components/Reusable/ProfileOptions';
import AuthLink from '../components/Reusable/AuthLink';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signUpErrorMessageHandler } from '../utils/errMessage';
import { CREATE_USER } from '../utils/graphQl/users';
import { useMutation } from '@apollo/client';
import AuthContainer from '../components/Reusable/AuthContainer';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [newUser] = useMutation(CREATE_USER);

  const handleSubmit = async (e) => {
    setLoading(true);
    if (error) {
      setError('');
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await newUser({
        variables: { lastActive: new Date().toISOString() },
      });
      navigate('/');
    } catch (err) {
      setError(signUpErrorMessageHandler(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: 'Get Started',
          text: 'Start by adding your email and password',
        }}
      />
      <ProfileOptions
        options={{
          buttonText: 'Sign Up',
          submitHandler: handleSubmit,
          error: error,
          loading: loading,
          field1: {
            type: 'email',
            placeholder: 'Add your email',
            title: 'Email',
            value: email,
            setValue: setEmail,
          },
          field2: {
            type: 'password',
            placeholder: 'Add your password',
            title: 'Password',
            value: password,
            setValue: setPassword,
          },
        }}
      />
      <AuthLink
        options={{
          text: 'Already have an account? ',
          linkText: 'Log in',
          route: '/login',
        }}
      />
    </AuthContainer>
  );
};

export default SignUp;
