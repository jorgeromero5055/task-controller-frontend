import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../components/Profile/PasswordReset';
import ResetEmail from '../components/Profile/EmailReset';
import DeleteAccount from '../components/Profile/DeleteAccount';

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
const { useMutation } = jest.requireMock('@apollo/client');

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
      await waitFor(async () => {
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
      });

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );

      expect(updatePassword).toHaveBeenCalledWith(mockUser, '123456');
      expect(window.location.href).toBe('/login?success=passwordReset');
    });

    it('reset password with error', async () => {
      delete window.location;
      window.location = { href: '' };
      reauthenticateWithCredential.mockRejectedValueOnce(
        new Error('Reset Password failed')
      );
      renderResetPassword();
      await waitFor(async () => {
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
      });

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );
      expect(updatePassword).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');

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
      await waitFor(async () => {
        const newEmailField = screen.getByPlaceholderText(
          'Enter your new email'
        );
        fireEvent.change(newEmailField, {
          target: { value: 'testing@emai2.com' },
        });

        const currentPasswordField = screen.getByPlaceholderText(
          'Enter your current password'
        );
        fireEvent.change(currentPasswordField, { target: { value: '654321' } });

        const updateEmailButton = screen.getByText('Update Email');
        fireEvent.click(updateEmailButton);
      });

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );

      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );

      expect(updateEmail).toHaveBeenCalledWith(mockUser, 'testing@emai2.com');
      expect(window.location.href).toBe('/login?success=emailReset');
    });

    it('reset email with error', async () => {
      delete window.location;
      window.location = { href: '' };
      reauthenticateWithCredential.mockRejectedValueOnce(
        new Error('Reset Password failed')
      );
      renderResetEmail();
      await waitFor(async () => {
        const newEmailField = screen.getByPlaceholderText(
          'Enter your new email'
        );
        fireEvent.change(newEmailField, {
          target: { value: 'testing@emai2.com' },
        });

        const currentPasswordField = screen.getByPlaceholderText(
          'Enter your current password'
        );
        fireEvent.change(currentPasswordField, { target: { value: '654321' } });

        const updateEmailButton = screen.getByText('Update Email');
        fireEvent.click(updateEmailButton);
      });

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        mockUser.email,
        '654321'
      );
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mockUser,
        undefined
      );
      expect(updateEmail).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');

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
    await waitFor(async () => {
      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });

      const deleteAccountButton = screen.getByText('Delete Account');
      fireEvent.click(deleteAccountButton);
    });

    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
      mockUser.email,
      '654321'
    );

    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      mockUser,
      undefined
    );

    expect(deleteUser).toHaveBeenCalledWith(mockUser);

    expect(mockDeleteFucntion).toHaveBeenCalled();
    expect(window.location.href).toBe('/signup');
  });

  it('delete account with error', async () => {
    delete window.location;
    window.location = { href: '' };
    reauthenticateWithCredential.mockRejectedValueOnce(
      new Error('Reset Password failed')
    );
    renderDeleteAccount();
    await waitFor(async () => {
      const currentPasswordField = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordField, { target: { value: '654321' } });

      const deleteAccountButton = screen.getByText('Delete Account');
      fireEvent.click(deleteAccountButton);
    });

    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
      mockUser.email,
      '654321'
    );

    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      mockUser,
      undefined
    );

    expect(deleteUser).not.toHaveBeenCalled();
    expect(mockDeleteFucntion).not.toHaveBeenCalled();

    expect(window.location.href).toBe('');

    await waitFor(async () => {
      expect(
        screen.getByText(
          'An error occurred while attempting to delete your account. Please try again.'
        )
      ).toBeInTheDocument();
    });
  });
});
