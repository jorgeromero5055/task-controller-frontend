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
  }, [searchParams]);

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: ' Email Recovery',
          text: 'loading',
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

// import React, { useState, useEffect } from 'react';
// import { getAuth, checkActionCode, applyActionCode } from 'firebase/auth';
// import { Link, useSearchParams } from 'react-router-dom';

// const EmailRecovery = () => {
//   const [searchParams] = useSearchParams();
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   console.log('Component rendered.');

//   useEffect(() => {
//     console.log('Running handleRecovery...');
//     const handleRecovery = async () => {
//       const auth = getAuth();

//       // Extract the action parameters from the URL
//       const mode = searchParams.get('mode');
//       const oobCode = searchParams.get('oobCode');

//       if (!mode || !oobCode) {
//         setError('Invalid or missing parameters.');
//         setIsLoading(false);
//         return;
//       }

//       if (mode === 'recoverEmail') {
//         try {
//           console.log('Step 1: Verifying action code...');
//           const info = await checkActionCode(auth, oobCode); // Verify the action code
//           console.log('Action code verified:', info);

//           console.log('Step 2: Applying action code...');
//           await applyActionCode(auth, oobCode); // Apply the recovery action
//           console.log('Action code applied successfully.');

//           // Set success message with email
//           const email = info?.data?.email || 'an unknown email';
//           setMessage(
//             `Your email recovery was successful. Your previous email address was ${email}.`
//           );
//         } catch (err) {
//           console.error('Error during recovery:', err);

//           // Handle specific Firebase error codes
//           if (err.code === 'auth/invalid-action-code') {
//             setError(
//               'The recovery link is invalid or has already been used. Please request a new recovery email.'
//             );
//           } else {
//             setError('Failed to recover email. Please try again later.');
//           }
//         } finally {
//           setIsLoading(false); // Stop loading indicator
//         }
//       } else {
//         setError('Invalid action mode.');
//         setIsLoading(false);
//       }
//     };

//     handleRecovery();
//   }, [searchParams]);

//   return (
//     <div>
//       <h1>Email Recovery</h1>
//       {isLoading && <p>Processing your request...</p>}
//       {message && (
//         <div>
//           <p style={{ color: 'green' }}>{message}</p>
//           <Link to="/login">Click here to log back in</Link>
//         </div>
//       )}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default EmailRecovery;
