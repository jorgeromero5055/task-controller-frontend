import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthHeader from '../components/Reusable/AuthHeader';
import ProfileOptions from '../components/Reusable/ProfileOptions';
import { updatePasswordErrorHandler } from '../utils/errMessage';
import AuthContainer from '../components/Reusable/AuthContainer';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPssword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    if (!oobCode) {
      setError('Invalid password reset link.');
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, confirmPassword);
      window.location.href = '/login?success=passwordReset';
    } catch (err) {
      setError(updatePasswordErrorHandler(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthHeader
        options={{
          title: 'Create New Password',
          text: 'New password must be at least 6 characters long',
        }}
      />
      <ProfileOptions
        options={{
          buttonText: 'Reset Password',
          submitHandler: handleSubmit,
          error: error,
          loading: loading,
          field1: {
            type: 'password',
            placeholder: 'Create your new password',
            title: 'New Password',
            value: newPassword,
            setValue: setNewPassword,
          },
          field2: {
            type: 'password',
            placeholder: 'Confirm your new password',
            title: 'Confirm Password',
            value: confirmPassword,
            setValue: setConfirmPssword,
          },
        }}
      />
    </AuthContainer>
  );
};

export default PasswordReset;

// import {
//   getAuth,
//   confirmPasswordReset,
//   verifyPasswordResetCode,
// } from 'firebase/auth';
// import { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const PasswordReset = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const oobCode = searchParams.get('oobCode');
//   const [resetPassword, setResetPassword] = useState({
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState({
//     newPassword: false,
//     confirmPassword: false,
//   });
//   const [error, setError] = useState({ newPassword: '', confirmPassword: '' });
//   const [authError, setAuthError] = useState('');

//   const changeHandler = (e) => {
//     const { id, value } = e.target;
//     setResetPassword((prev) => {
//       return { ...prev, [id]: value };
//     });
//     if (error[id]) {
//       setError((prev) => {
//         return { ...prev, [id]: '' };
//       });
//     }
//   };

//   const handleBlur = (e) => {
//     const { id } = e.target;
//     if (!resetPassword[id]) {
//       setError((prev) => {
//         return { ...prev, [id]: "Field Can't be left empty" };
//       });
//     } else if (
//       id === 'confirmPassword' &&
//       resetPassword[id] != resetPassword.newPassword
//     ) {
//       setError((prev) => {
//         return { ...prev, [id]: 'Password must match' };
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!oobCode) {
//       setAuthError('Invalid password reset link.');
//       return;
//     }

//     try {
//       const auth = getAuth();
//       //   await verifyPasswordResetCode(auth, oobCode);
//       await confirmPasswordReset(auth, oobCode, resetPassword.newPassword);
//       navigate('/login');
//     } catch (err) {
//       let errorMessage;
//       switch (error.code) {
//         case 'auth/expired-action-code':
//           errorMessage =
//             'This reset link has expired. Please request a new one.';
//           break;
//         case 'auth/invalid-action-code':
//           errorMessage = 'This reset link is invalid. Please try again.';
//           break;
//         case 'auth/weak-password':
//           errorMessage =
//             'The new password is too weak. Please use a stronger password.';
//           break;
//         case 'auth/internal-error':
//           errorMessage = 'An internal error occurred. Please try again later.';
//           break;
//         default:
//           errorMessage =
//             'An error occurred while resetting your password. Please try again.';
//       }

//       setAuthError(errorMessage);
//     }
//   };

//   const cancelHandler = () => {
//     setResetPassword({
//       newPassword: '',
//       confirmPassword: '',
//     });
//     setError({
//       newPassword: '',
//       confirmPassword: '',
//     });
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="newPassword">New Password</label>
//           <input
//             type={showPassword.newPassword ? 'text' : 'password'}
//             onBlur={handleBlur}
//             onChange={changeHandler}
//             value={resetPassword.newPassword}
//             id="newPassword"
//           />
//           <button
//             onClick={() =>
//               setShowPassword((prev) => ({
//                 ...prev,
//                 newPassword: !prev.newPassword,
//               }))
//             }
//             type="button"
//           >
//             Show Password
//           </button>
//           {error.newPassword && <p>{error.newPassword}</p>}
//         </div>
//         <div>
//           <label htmlFor="confirmPassword">Confirm Password</label>
//           <input
//             onBlur={handleBlur}
//             type={showPassword.confirmPassword ? 'text' : 'password'}
//             onChange={changeHandler}
//             value={resetPassword.confirmPassword}
//             id="confirmPassword"
//           />
//           <button
//             onClick={() =>
//               setShowPassword((prev) => ({
//                 ...prev,
//                 confirmPassword: !prev.confirmPassword,
//               }))
//             }
//             type="button"
//           >
//             Show Password
//           </button>
//           {error.confirmPassword && <p>{error.confirmPassword}</p>}
//         </div>
//         <button
//           type="submit"
//           disabled={
//             !resetPassword.newPassword ||
//             !resetPassword.confirmPassword ||
//             resetPassword.newPassword !== resetPassword.confirmPassword
//           }
//         >
//           Reset Password
//         </button>
//         <button type="button" onClick={cancelHandler}>
//           Cancel
//         </button>
//       </form>
//       {authError && <p>{authError}</p>}
//     </div>
//   );
// };

// export default PasswordReset;
