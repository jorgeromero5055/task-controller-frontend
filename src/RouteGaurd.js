import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACTIVE_USER } from './utils/graphQl/users';
import Loading from './Pages/Loading';

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
        if (!isAuthPath && !isSame) {
          navigate('/login');
        }
      } else {
        if (isAuthPath) {
          navigate('/');
        }
      }
    }
    // eslint-disable-next-line
  }, [loading, data, error]);

  if (loading) return <Loading />;

  return children;
};

export default RouteGuard;
