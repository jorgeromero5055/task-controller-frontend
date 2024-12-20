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
    const auth = getAuth();
    console.log('authauthauth', auth);

    try {
      console.log('authauthauth', auth);
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error(err.code);
      setError(sendPasswordResetErrorHandler(error.code));
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

// import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// import { useState } from 'react';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [validationErr, setValidationErr] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const auth = getAuth();
//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage('Password reset email sent. Please check your inbox.');
//     } catch (err) {
//       console.error(err);
//       let errorMessage;
//       switch (error.code) {
//         case 'auth/user-not-found':
//           errorMessage = 'No account found with this email.';
//           break;
//         case 'auth/invalid-email':
//           errorMessage = 'Invalid email address. Please check and try again.';
//           break;
//         default:
//           errorMessage = 'An error occurred. Please try again later.';
//       }
//       setError(errorMessage);
//     }
//   };
//   const handleBlur = (e) => {
//     if (!email) {
//       setValidationErr('This cannot be left blank');
//     }
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="email">Enter your email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           id="email"
//           onBlur={handleBlur}
//         />
//         {validationErr && <p>{validationErr}</p>}
//         <button
//           disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
//           type="submit"
//         >
//           Send Reset Email
//         </button>
//       </form>
//       {message && <p>{message}</p>}
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;
