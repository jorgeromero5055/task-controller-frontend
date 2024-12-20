import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACTIVE_USER } from './utils/graphQl/users';

const RouteGuard = ({ children }) => {
  const { data, loading, error } = useQuery(ACTIVE_USER);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const currentPath = location.pathname;
      const isAuthPath =
        currentPath === '/login' ||
        currentPath === '/signup' ||
        currentPath === '/reset-password' ||
        currentPath === '/forgot-password';

      const isSame = currentPath === '/email-recovery';

      if (error) {
        console.log('error hit');
        if (!isAuthPath && !isSame) {
          navigate('/login');
        }
      } else {
        console.log('success hit');
        if (isAuthPath) {
          navigate('/');
        }
      }
    }
  }, [loading, data, error]);

  if (loading) return <></>;

  return children; // Render the child route if valid
};

export default RouteGuard;
