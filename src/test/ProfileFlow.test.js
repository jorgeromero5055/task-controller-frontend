import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../components/Profile/PasswordReset';
import ResetEmail from '../components/Profile/EmailReset';
import DeleteAccount from '../components/Profile/DeleteAccount';

const returnUseNavigate = jest.fn();
const useNavigateReturn = () => {
  return returnUseNavigate;
};

jest.mock('react-router-dom', () => {
  return {
    useNavigate: useNavigateReturn,
  };
});

const mockUser = { uid: 'test-user-id', email: 'test@email.com' };

jest.mock('firebase/auth', () => {
  return {
    EmailAuthProvider: {
      credential: jest.fn(),
    },
    reauthenticateWithCredential: jest.fn(),
    updatePassword: jest.fn(),
    updateEmail: jest.fn(),
    deleteUser: jest.fn(),
  };
});

const mockDeleteFucntion = jest.fn();
const {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  deleteUser,
} = jest.requireMock('firebase/auth');

jest.mock('@apollo/client', () => {
  return {
    useMutation: () => [mockDeleteFucntion],
  };
});

jest.mock('../utils/graphQl/users', () => ({
  DELETE_USER: ``,
}));

const renderResetPassword = () => {
  return render(<ResetPassword user={mockUser} />);
};

const renderResetEmail = () => {
  return render(<ResetEmail user={mockUser} />);
};

const renderDeleteAccount = () => {
  return render(<DeleteAccount user={mockUser} />);
};

describe('Profile Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Reset Password Flow', () => {
    it('reset password renders correctly', async () => {
      renderResetPassword();
      expect(screen.getByText('Current Password')).toBeInTheDocument();
      expect(screen.getByText('New Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });

    it('reset password with success', async () => {
      delete window.location;
      window.location = { href: '' };
      renderResetPassword();

      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });
      const newPasswordField = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordField, { target: { value: '123456' } });
      const confirmPasswordField = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPasswordField, { target: { value: '123456' } });
      const resetPasswordButton = screen.getByText('Reset Password');
      fireEvent.click(resetPasswordButton);
      await waitFor(async () => {
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
          mockUser.email,
          '654321'
        );
      });

      await waitFor(async () => {
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(
          mockUser,
          undefined
        );
      });

      await waitFor(async () => {
        expect(updatePassword).toHaveBeenCalledWith(mockUser, '123456');
      });
      await waitFor(async () => {
        expect(window.location.href).toBe('/login?success=passwordReset');
      });
    });

    it('reset password with error', async () => {
      delete window.location;
      window.location = { href: '' };
      reauthenticateWithCredential.mockRejectedValueOnce(
        new Error('Reset Password failed')
      );
      renderResetPassword();

      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });
      const newPasswordField = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordField, { target: { value: '123456' } });
      const confirmPasswordField = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPasswordField, { target: { value: '123456' } });
      const resetPasswordButton = screen.getByText('Reset Password');
      fireEvent.click(resetPasswordButton);
      await waitFor(async () => {
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
          mockUser.email,
          '654321'
        );
      });

      await waitFor(async () => {
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(
          mockUser,
          undefined
        );
      });

      await waitFor(async () => {
        expect(updatePassword).not.toHaveBeenCalled();
      });

      await waitFor(async () => {
        expect(window.location.href).toBe('');
      });

      await waitFor(async () => {
        expect(
          screen.getByText('An error occurred. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('reset email renders correctly', async () => {
      renderResetEmail();
      expect(screen.getByText('New Email')).toBeInTheDocument();
      expect(screen.getByText('Current Password')).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Update Email')).toBeInTheDocument();
    });

    it('reset email with success', async () => {
      delete window.location;
      window.location = { href: '' };
      renderResetEmail();
      const newEmailField = screen.getByPlaceholderText('Enter your new email');
      fireEvent.change(newEmailField, {
        target: { value: 'testing@emai2.com' },
      });

      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });

      const updateEmailButton = screen.getByText('Update Email');
      fireEvent.click(updateEmailButton);
      await waitFor(async () => {
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
          mockUser.email,
          '654321'
        );
      });

      await waitFor(async () => {
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(
          mockUser,
          undefined
        );
      });

      await waitFor(async () => {
        expect(updateEmail).toHaveBeenCalledWith(mockUser, 'testing@emai2.com');
      });

      await waitFor(async () => {
        expect(window.location.href).toBe('/login?success=emailReset');
      });
    });

    it('reset email with error', async () => {
      delete window.location;
      window.location = { href: '' };
      reauthenticateWithCredential.mockRejectedValueOnce(
        new Error('Reset Password failed')
      );
      renderResetEmail();

      const newEmailField = screen.getByPlaceholderText('Enter your new email');
      fireEvent.change(newEmailField, {
        target: { value: 'testing@emai2.com' },
      });

      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });

      const updateEmailButton = screen.getByText('Update Email');
      fireEvent.click(updateEmailButton);
      await waitFor(async () => {
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
          mockUser.email,
          '654321'
        );
      });

      await waitFor(async () => {
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(
          mockUser,
          undefined
        );
      });

      await waitFor(async () => {
        expect(updateEmail).not.toHaveBeenCalled();
      });

      await waitFor(async () => {
        expect(window.location.href).toBe('');
      });

      await waitFor(async () => {
        expect(
          screen.getByText('An error occurred. Please try again.')
        ).toBeInTheDocument();
      });
    });
  });

  it('delete account renders correctly', async () => {
    renderDeleteAccount();
    expect(screen.getByText('Current Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('delete account with success', async () => {
    delete window.location;
    window.location = { href: '' };
    renderDeleteAccount();

    const currentPasswordField = screen.getByPlaceholderText(
      'Enter your current password'
    );
    fireEvent.change(currentPasswordField, { target: { value: '654321' } });

    const deleteAccountButton = screen.getByText('Delete Account');
    fireEvent.click(deleteAccountButton);

    await waitFor(async () => {
      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );
    });

    await waitFor(async () => {
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );
    });

    await waitFor(async () => {
      expect(deleteUser).toHaveBeenCalledWith(mockUser);
    });

    await waitFor(async () => {
      expect(mockDeleteFucntion).toHaveBeenCalled();
    });

    await waitFor(async () => {
      expect(window.location.href).toBe('/signup');
    });
  });

  it('delete account with error', async () => {
    delete window.location;
    window.location = { href: '' };
    reauthenticateWithCredential.mockRejectedValueOnce(
      new Error('Reset Password failed')
    );
    renderDeleteAccount();

    const currentPasswordField = screen.getByPlaceholderText(
      'Enter your current password'
    );
    fireEvent.change(currentPasswordField, { target: { value: '654321' } });

    const deleteAccountButton = screen.getByText('Delete Account');
    fireEvent.click(deleteAccountButton);

    await waitFor(async () => {
      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );
    });

    await waitFor(async () => {
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );
    });

    await waitFor(async () => {
      expect(deleteUser).not.toHaveBeenCalled();
    });

    await waitFor(async () => {
      expect(mockDeleteFucntion).not.toHaveBeenCalled();
    });

    await waitFor(async () => {
      expect(window.location.href).toBe('');
    });

    await waitFor(async () => {
      expect(
        screen.getByText(
          'An error occurred while attempting to delete your account. Please try again.'
        )
      ).toBeInTheDocument();
    });
  });
});
