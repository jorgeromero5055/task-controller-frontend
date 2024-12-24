import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProfileOptions from '../components/Reusable/ProfileOptions';

const mockSetField1Value = jest.fn();
const mockSetField2Value = jest.fn();
const mockSetField3Value = jest.fn();

let mockOptions;

const passwordOptions = {
  buttonText: 'Reset Password',
  submitHandler: jest.fn(),
  error: '',
  loading: false,
  field1: {
    type: 'password',
    placeholder: 'Enter your current password',
    title: 'Current Password',
    value: '',
    setValue: mockSetField1Value,
  },
  field2: {
    type: 'password',
    placeholder: 'Enter your new password',
    title: 'New Password',
    value: '',
    setValue: mockSetField2Value,
    prevPassword: true,
  },
  field3: {
    type: 'password',
    placeholder: 'Confirm your new password',
    title: 'Confirm Password',
    value: '',
    setValue: mockSetField3Value,
  },
};
const mockEmailField = {
  type: 'email',
  placeholder: 'Enter your email',
  title: 'Email',
  value: '',
  setValue: mockSetField1Value,
};

const mockForgotPassword = jest.fn();
window.open = mockForgotPassword;

const renderProfileOptions = () => {
  return render(<ProfileOptions options={mockOptions} />);
};

describe('Profile Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOptions = { ...passwordOptions };
  });

  describe('Render Fields Correctly', () => {
    it('renders password fields correctly', () => {
      renderProfileOptions();
      expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    });

    it('renders email field correctly', () => {
      mockOptions = { ...mockOptions, field1: mockEmailField };
      renderProfileOptions();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });
  });

  describe('Change Input Succsefully', () => {
    it('Changes curent password with success', async () => {
      mockOptions.field1.value = '654321';
      renderProfileOptions();
      const currentPasswordInput = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordInput, { target: { value: '1234567' } });
      fireEvent.blur(currentPasswordInput);
      await waitFor(async () => {
        expect(mockSetField1Value).toHaveBeenCalledWith('1234567');
      });

      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Changes new password with success', async () => {
      mockOptions.field2.value = '123456';
      renderProfileOptions();
      const newPasswordInput = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordInput, { target: { value: '1234567' } });
      fireEvent.blur(newPasswordInput);
      await waitFor(async () => {
        expect(mockSetField2Value).toHaveBeenCalledWith('1234567');
      });

      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Changes confirm password with success', async () => {
      mockOptions.field2.value = '123456';
      mockOptions.field3.value = '123456';
      renderProfileOptions();
      const confirmPasswordInput = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPasswordInput, { target: { value: '1234567' } });
      fireEvent.blur(confirmPasswordInput);
      await waitFor(async () => {
        expect(mockSetField3Value).toHaveBeenCalledWith('1234567');
      });

      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Changes email with success', async () => {
      mockOptions = { ...mockOptions, field1: { ...mockEmailField } };
      mockOptions.field1.value = 'test@email.com';
      renderProfileOptions();
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'testing@email.com' } });
      fireEvent.blur(emailInput);
      await waitFor(async () => {
        expect(mockSetField1Value).toHaveBeenCalledWith('testing@email.com');
      });
      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Change Input with Error', () => {
    it('Changes curent password with no value error', async () => {
      renderProfileOptions();
      const currentPasswordInput = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(currentPasswordInput);

      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes current password with short value error', async () => {
      mockOptions.field1.value = '12345';
      renderProfileOptions();
      const currentPasswordInput = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(currentPasswordInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes new password with no value error', async () => {
      renderProfileOptions();
      const newPasswordInput = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(newPasswordInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes new password with short value error', async () => {
      mockOptions.field2.value = '12345';
      renderProfileOptions();
      const newPasswordInput = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(newPasswordInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes confirm password with no value error', async () => {
      renderProfileOptions();
      const confirmPasswordInput = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(confirmPasswordInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes current password with non matching value error', async () => {
      mockOptions.field2.value = '123456';
      mockOptions.field3.value = '1234567';
      renderProfileOptions();
      const newPasswordInput = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(newPasswordInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes email with no value error', async () => {
      mockOptions = { ...mockOptions, field1: mockEmailField };
      renderProfileOptions();
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, {
        target: { value: '' },
      });
      fireEvent.blur(emailInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });

    it('Changes email with invalid email error', async () => {
      mockOptions = {
        ...mockOptions,
        field1: { ...mockEmailField, value: 'testing' },
      };
      renderProfileOptions();
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, {
        target: { value: '' },
      });
      fireEvent.blur(emailInput);
      await waitFor(async () => {
        expect(screen.getByLabelText('error message')).toBeInTheDocument();
      });
    });
  });

  describe('Clear Error Fields', () => {
    it('Clear current password error', async () => {
      renderProfileOptions();
      const currentPasswordInput = screen.getByPlaceholderText(
        'Enter your current password'
      );
      fireEvent.change(currentPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(currentPasswordInput);
      fireEvent.change(currentPasswordInput, {
        target: { value: 'a' },
      });
      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Clear new password error', async () => {
      renderProfileOptions();
      const newPasswordInput = screen.getByPlaceholderText(
        'Enter your new password'
      );
      fireEvent.change(newPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(newPasswordInput);
      fireEvent.change(newPasswordInput, {
        target: { value: 'a' },
      });
      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Clear confirm password error', async () => {
      renderProfileOptions();
      const confirmPasswordInput = screen.getByPlaceholderText(
        'Confirm your new password'
      );
      fireEvent.change(confirmPasswordInput, {
        target: { value: '' },
      });
      fireEvent.blur(confirmPasswordInput);
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'a' },
      });
      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });

    it('Clear email error', async () => {
      mockOptions = { ...mockOptions, field1: mockEmailField };
      renderProfileOptions();
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, {
        target: { value: '' },
      });
      fireEvent.blur(emailInput);
      fireEvent.change(emailInput, {
        target: { value: 'a' },
      });
      await waitFor(async () => {
        expect(
          screen.queryByLabelText('error message')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('password buttons', () => {
    it('navigate forgot password correctly', async () => {
      renderProfileOptions();
      const forgotPasswordButton = screen.getByText('Forgot password?');
      fireEvent.click(forgotPasswordButton);
      expect(mockForgotPassword).toHaveBeenCalledWith(
        'http://localhost:3000/forgot-password',
        '_blank'
      );
    });
  });

  it('toggle password visibility correctly', async () => {
    renderProfileOptions();

    const currentPasswordInput = screen.getByPlaceholderText(
      'Enter your current password'
    );

    const newPasswordInput = screen.getByPlaceholderText(
      'Enter your new password'
    );

    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    );

    const toggleButtons = screen.getAllByLabelText(
      'toggle password visibility'
    );

    toggleButtons.forEach(async (button) => {
      fireEvent.click(button);
    });

    await waitFor(async () => {
      expect(currentPasswordInput).toHaveAttribute('type', 'text');
    });
    await waitFor(async () => {
      expect(newPasswordInput).toHaveAttribute('type', 'text');
    });
    await waitFor(async () => {
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });
});
