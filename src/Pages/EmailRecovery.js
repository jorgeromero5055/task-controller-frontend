import React, { useState, useEffect } from 'react';
import { getAuth, checkActionCode, applyActionCode } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { actionCodeErrorHandler } from '../utils/errMessage';
import GoBackButton from '../components/Reusable/GoBackButton';
import AuthHeader from '../components/Reusable/AuthHeader';
import AuthContainer from '../components/Reusable/AuthContainer';

const EmailRecovery = () => {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRecovery = async () => {
      const auth = getAuth();
      // Extract the action parameters from the URL
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      if (!mode || !oobCode) {
        setError('Invalid or missing parameters.');
        return;
      }
      if (mode === 'recoverEmail') {
        try {
          const info = await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);
          const email = info?.data?.email || 'an unknown email';
          setSuccess(
            `Your email recovery was successful. Your previous email address was ${email}.`
          );
        } catch (err) {
          setError(actionCodeErrorHandler(err.code));
        }
      } else {
        setError('Invalid action mode.');
      }
    };
    handleRecovery();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: ' Email Recovery',
          text: 'Loading ...',
          success: success,
          error: error,
        }}
      />
      <GoBackButton
        options={{
          text: 'Go to login',
          goBack: () => {
            success
              ? (window.location.href = '/login?success=emailReset')
              : (window.location.href = '/login');
          },
        }}
      />
    </AuthContainer>
  );
};

export default EmailRecovery;
