import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogIn from '../Pages/LogIn';
import Signup from '../Pages/SignUp';
import PasswordReset from '../Pages/PasswordReset';
import ForgotPassword from '../Pages/ForgotPassword';
import EmailRecovery from '../Pages/EmailRecovery';

const returnUseNavigate = jest.fn();
const useNavigateReturn = () => {
  return returnUseNavigate;
};

jest.mock('react-router-dom', () => {
  return {
    useNavigate: useNavigateReturn,
    useLocation: () => ({
      pathname: '/test',
      search: '?success=passwordReset',
    }),
    useSearchParams: () => [
      {
        get: (param) => {
          if (param === 'oobCode') return 'oobCode';
          else if (param === 'mode') return 'recoverEmail';
        },
      },
    ],
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: () => {
      return { uid: 'test-user-id', email: 'test@example.com' };
    },
    checkActionCode: jest.fn(() => ({ data: { email: 'test@example.com' } })),
    applyActionCode: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    confirmPasswordReset: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
  };
});

const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  checkActionCode,
  applyActionCode,
} = jest.requireMock('firebase/auth');

jest.mock('../firebaseConfig', () => {
  return {
    auth: {
      currentUser: { uid: 'test-user-id', email: 'test@example.com' },
    },
  };
});

jest.mock('../utils/graphQl/users', () => ({
  CREATE_USER: ``,
}));

jest.mock('@apollo/client', () => {
  return {
    useMutation: () => [jest.fn()],
  };
});

const renderLogIn = () => {
  return render(<LogIn />);
};
const renderSignup = () => {
  return render(<Signup />);
};
const renderForgotPassword = () => {
  return render(<ForgotPassword />);
};
const renderPasswordReset = () => {
  return render(<PasswordReset />);
};

const renderEmailRecovery = () => {
  return render(<EmailRecovery />);
};

describe('Auth Flow', () => {
  beforeEach(() => {
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn(),
    }));
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('login renders correctly', () => {
      renderLogIn();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('login renders successfull password reset', () => {
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: () => 'passwordReset',
      }));
      renderLogIn();
      expect(
        screen.getByText(
          'Your password has been reset successfully. Please log in.'
        )
      ).toBeInTheDocument();
    });

    it('login renders successfull email reset', () => {
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: () => 'emailReset',
      }));
      renderLogIn();
      expect(
        screen.getByText(
          'Your email has been reset successfully. Please log in.'
        )
      ).toBeInTheDocument();
    });

    it('login submits with success', async () => {
      renderLogIn();
      const emailField = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const passwordField = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordField, { target: { value: '123456' } });
      const loginButton = screen.getByText('Log in');
      fireEvent.click(loginButton);

      await waitFor(async () => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          {
            currentUser: { uid: 'test-user-id', email: 'test@example.com' },
          },
          'test@email.com',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(returnUseNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('login submits with faliure', async () => {
      signInWithEmailAndPassword.mockRejectedValueOnce(
        new Error('Login failed')
      );
      renderLogIn();

      const emailField = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const passwordField = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordField, { target: { value: '123456' } });
      const loginButton = screen.getByText('Log in');
      fireEvent.click(loginButton);

      await waitFor(async () => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          {
            currentUser: { uid: 'test-user-id', email: 'test@example.com' },
          },
          'test@email.com',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(
          screen.getByText(
            'An unexpected error occurred. Please check your credentials and try again.'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('SignUp Flow', () => {
    it('signup renders correctly', async () => {
      renderSignup();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('signup submits with success', async () => {
      renderSignup();
      const emailField = screen.getByPlaceholderText('Add your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const passwordField = screen.getByPlaceholderText('Add your password');
      fireEvent.change(passwordField, { target: { value: '123456' } });
      const signUpButton = screen.getByText('Sign Up');
      fireEvent.click(signUpButton);
      await waitFor(async () => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          {
            currentUser: { uid: 'test-user-id', email: 'test@example.com' },
          },
          'test@email.com',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(returnUseNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('signup submits with faliure', async () => {
      createUserWithEmailAndPassword.mockRejectedValueOnce(
        new Error('Sign Up failed')
      );
      renderSignup();
      const emailField = screen.getByPlaceholderText('Add your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const passwordField = screen.getByPlaceholderText('Add your password');
      fireEvent.change(passwordField, { target: { value: '123456' } });
      const signUpButton = screen.getByText('Sign Up');
      fireEvent.click(signUpButton);

      await waitFor(async () => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          {
            currentUser: { uid: 'test-user-id', email: 'test@example.com' },
          },
          'test@email.com',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(returnUseNavigate).not.toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(
          screen.getByText(
            'An unexpected error occurred. Please check your information and try again.'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Forgot Password', () => {
    it('forgot password renders correctly', async () => {
      renderForgotPassword();
      expect(screen.getByText('Current Email')).toBeInTheDocument();
      expect(screen.getByText('Send Instructions')).toBeInTheDocument();
      expect(screen.getByText('Go to login')).toBeInTheDocument();
    });

    it('forgot password submits with success', async () => {
      renderForgotPassword();

      const emailField = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const sendInstructionsButton = screen.getByText('Send Instructions');
      fireEvent.click(sendInstructionsButton);

      await waitFor(async () => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'test@email.com'
        );
      });
    });

    it('forgot password submits with faliure', async () => {
      sendPasswordResetEmail.mockRejectedValueOnce(
        new Error('Sending Instructions failed')
      );

      renderForgotPassword();

      const emailField = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailField, { target: { value: 'test@email.com' } });
      const sendInstructionsButton = screen.getByText('Send Instructions');
      fireEvent.click(sendInstructionsButton);

      await waitFor(async () => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'test@email.com'
        );
      });

      await waitFor(async () => {
        expect(
          screen.getByText(
            'An error occurred while trying to send the password reset email. Please try again later.'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset', () => {
    it('password reset renders correctly', async () => {
      renderPasswordReset();
      expect(screen.getByText('New Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });

    it('password reset submits with success', async () => {
      delete window.location;
      window.location = { href: '' };
      renderPasswordReset();

      const newPasswordField = screen.getByPlaceholderText(
        'Create your new password'
      );
      fireEvent.change(newPasswordField, { target: { value: '123456' } });

      const confirmPassword = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPassword, { target: { value: '123456' } });

      const ResetPassword = screen.getByText('Reset Password');
      fireEvent.click(ResetPassword);

      await waitFor(async () => {
        expect(confirmPasswordReset).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'oobCode',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(window.location.href).toBe('/login?success=passwordReset');
      });
    });

    it('password reset submits with faliure', async () => {
      confirmPasswordReset.mockRejectedValueOnce(
        new Error('Reset Password failed')
      );
      delete window.location;
      window.location = { href: '' };

      renderPasswordReset();

      const newPasswordField = screen.getByPlaceholderText(
        'Create your new password'
      );
      fireEvent.change(newPasswordField, { target: { value: '123456' } });

      const confirmPassword = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPassword, { target: { value: '123456' } });

      const ResetPassword = screen.getByText('Reset Password');
      fireEvent.click(ResetPassword);

      await waitFor(async () => {
        expect(confirmPasswordReset).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'oobCode',
          '123456'
        );
      });
      await waitFor(async () => {
        expect(window.location.href).toBe('');
      });
      await waitFor(async () => {
        expect(
          screen.getByText(
            'An error occurred while trying to update your password. Please try again later.'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Email Recovery', () => {
    it('email recovery Recovery renders with success state', async () => {
      renderEmailRecovery();
      await waitFor(async () => {
        expect(checkActionCode).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'oobCode'
        );
      });
      await waitFor(async () => {
        expect(applyActionCode).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'oobCode'
        );
      });
      await waitFor(async () => {
        expect(
          screen.getByText(
            'Your email recovery was successful. Your previous email address was an unknown email.'
          )
        ).toBeInTheDocument();
      });
    });

    it('email recovery renders with error state', async () => {
      checkActionCode.mockRejectedValueOnce(new Error('Reset email failed'));
      renderEmailRecovery();
      await waitFor(async () => {
        expect(checkActionCode).toHaveBeenCalledWith(
          { uid: 'test-user-id', email: 'test@example.com' },
          'oobCode'
        );
      });
      await waitFor(async () => {
        expect(applyActionCode).not.toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(
          screen.getByText(
            'An error occurred while processing your request. Please try again later.'
          )
        ).toBeInTheDocument();
      });
    });
  });
});
