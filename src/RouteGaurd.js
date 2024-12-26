import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ACTIVE_USER } from './utils/graphQl/users';
import PageContainer from './components/Reusable/PageContainer';
import styles from './styles/RouteGuard.module.css'; // Import the CSS Module
import ErrorField from './components/Reusable/ErrorField';
import { isAuthPath } from './utils/helpers';

const RouteGuard = ({ children }) => {
  const { data, loading, error } = useQuery(ACTIVE_USER);
  const [errorState, setErrorState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('data', data);
    if (!loading) {
      if (error) {
        if (error.message === 'Invalid User') {
          if (!isAuthPath()) {
            navigate('/login');
          }
        } else {
          setErrorState(error.message);
        }
      } else if (!error && isAuthPath()) {
        navigate('/');
      }
    }
    // eslint-disable-next-line
  }, [loading, data, error]);

  if (loading)
    return (
      <PageContainer>{<div className={styles.spinner}></div>}</PageContainer>
    );
  if (errorState)
    return (
      <PageContainer>
        {<ErrorField error={errorState + ' Please try again'} />}
      </PageContainer>
    );

  return children;
};

export default RouteGuard;
