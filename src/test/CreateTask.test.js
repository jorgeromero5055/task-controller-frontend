import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/Navbar/CreateForm'; // Adjust the import path as needed
import { formatSingleDateObject } from '../utils/helpers';

const mockAddTask = jest.fn();

jest.mock('../contexts/TaskContext', () => ({
  useTaskContext: () => ({
    addTask: mockAddTask,
  }),
}));

const renderComponent = (props = {}) => {
  return render(<TaskForm setVisibleSection={jest.fn()} />);
};

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('renders all form elements correctly', () => {
      renderComponent();

      // Check for key form labels
      expect(screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Add Subtask/i)).toBeInTheDocument();

      // Check for buttons
      expect(screen.getByText(/Create/i)).toBeInTheDocument();
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
  });

  describe('Input Changes', () => {
    it('updates task name input correctly', () => {
      renderComponent();

      const nameInput = screen.getByPlaceholderText("What's on your mind");
      fireEvent.change(nameInput, { target: { value: 'New Task' } });

      expect(nameInput.value).toBe('New Task');
    });

    it('updates description input correctly', () => {
      renderComponent();

      const descInput = screen.getByPlaceholderText('Add a description');
      fireEvent.change(descInput, { target: { value: 'Task description' } });

      expect(descInput.value).toBe('Task description');
    });

    it('updates priority dropdown correctly', () => {
      renderComponent();

      // Open dropdown and select an option
      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      const mediumOption = screen.getByText('Moderate Priority');
      fireEvent.click(mediumOption);

      // Verify the selected option (this might need adjustment based on your dropdown implementation)
      expect(screen.getByText('Moderate Priority')).toBeInTheDocument();
    });

    it('onBlur closes priority dropdown', async () => {
      renderComponent();
      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      fireEvent.blur(priorityDropdown);
      await waitFor(() => {
        expect(screen.queryByText('Moderate Priority')).not.toBeInTheDocument();
      });
    });

    it('updates due date today correctly', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const today = new Date();

      const todayString = today.toDateString();

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(todayString);

      fireEvent.click(dateOption);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      expect(
        screen.getByText(`${formatSingleDateObject(today)}`)
      ).toBeInTheDocument();
    });

    it('onBlur closes date dropdown', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);
      const today = new Date();
      const todayString = today.toDateString();
      // Wait for the element with the matching aria-label to appear
      await screen.findByLabelText(todayString);
      fireEvent.blur(dateInput);

      expect(
        screen.queryByText(`${formatSingleDateObject(today)}`)
      ).not.toBeInTheDocument();
    });

    it('adds subtask correctly', async () => {
      renderComponent();

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      await waitFor(async () => {
        expect(screen.getByLabelText('subtask item 1')).toBeInTheDocument();
      });
    });

    it('subtask checked correctly', async () => {
      renderComponent();

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      const subtaskInputCheckbox1 = await screen.findByLabelText(
        `subtask 1 input checkbox`
      );

      fireEvent.click(subtaskInputCheckbox1);

      await waitFor(() => {
        expect(subtaskInputCheckbox1).toBeChecked();
      });
    });

    it('subtask unchecked correctly', async () => {
      renderComponent();

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      const subtaskInputCheckbox1 = await screen.findByLabelText(
        `subtask 1 input checkbox`
      );

      fireEvent.click(subtaskInputCheckbox1);

      fireEvent.click(subtaskInputCheckbox1);

      await waitFor(() => {
        expect(subtaskInputCheckbox1).not.toBeChecked();
      });
    });

    it('subtask writes correctly', async () => {
      renderComponent();

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      const subtaskInput1 = await screen.findByLabelText(`subtask 1 input`);

      fireEvent.change(subtaskInput1, {
        target: { value: 'test' },
      });
      const inputValue = subtaskInput1.value;
      await waitFor(() => {
        expect(inputValue).toBe('test');
      });
    });

    it('subtask deletes correctly', async () => {
      renderComponent();

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      const subtasDeleteButton1 = await screen.findByLabelText(
        `subtask 1 delete button`
      );

      fireEvent.click(subtasDeleteButton1);

      await waitFor(() => {
        expect(
          screen.queryByLabelText('subtask item 1')
        ).not.toBeInTheDocument();
      });
    });

    it('clear error when change is triggered', async () => {
      mockAddTask.mockRejectedValueOnce(new Error('Failed to create task'));
      renderComponent();

      const submitButton = screen.getByText(/Create/i);

      fireEvent.click(submitButton);

      await waitFor(() => {
        screen.getByText('Failed to create task please try again');
      });

      const nameInput = screen.getByPlaceholderText("What's on your mind");
      fireEvent.change(nameInput, { target: { value: 'New Task' } });

      await waitFor(() => {
        expect(
          screen.queryByText('Failed to create task please try again')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Success', () => {
    it('render form with correct fields', async () => {
      renderComponent();

      const nameInput = screen.getByPlaceholderText("What's on your mind");
      fireEvent.change(nameInput, { target: { value: 'New Task' } });

      const descInput = screen.getByPlaceholderText('Add a description');
      fireEvent.change(descInput, { target: { value: 'Task description' } });

      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      const mediumOption = screen.getByText('Moderate Priority');
      fireEvent.click(mediumOption);

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const today = new Date();

      const todayString = today.toDateString();

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(todayString);

      fireEvent.click(dateOption);

      const addSubtask = screen.queryByLabelText('add subtask');
      fireEvent.click(addSubtask);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      const submitButton = screen.getByText(/Create/i);
      fireEvent.click(submitButton);

      expect(mockAddTask).toHaveBeenCalledWith({
        name: 'New Task',
        description: 'Task description',
        date: today.toLocaleDateString(),
        completed: false,
        overdue: false,
        priority: 'Moderate Priority',
        subtasks: [
          expect.objectContaining({
            id: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
            text: '',
            checked: false,
          }),
        ],
      });

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });

      await waitFor(() => {
        expect(descInput.value).toBe('');
      });

      await waitFor(() => {
        expect(screen.getByText(/none/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Select a date')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByLabelText('subtask item 1')
        ).not.toBeInTheDocument();
      });
    });

    it('submits form with correct overdue data', async () => {
      renderComponent();

      const nameInput = screen.getByPlaceholderText("What's on your mind");
      fireEvent.change(nameInput, { target: { value: 'New Task' } });

      const descInput = screen.getByPlaceholderText('Add a description');
      fireEvent.change(descInput, { target: { value: 'Task description' } });

      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      const mediumOption = screen.getByText('Moderate Priority');
      fireEvent.click(mediumOption);

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayString = yesterday.toDateString();

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(yesterdayString);

      fireEvent.click(dateOption);

      const addSubtask = screen.queryByLabelText('add subtask');
      fireEvent.click(addSubtask);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      const submitButton = screen.getByText(/Create/i);
      fireEvent.click(submitButton);

      expect(mockAddTask).toHaveBeenCalledWith({
        name: 'New Task',
        description: 'Task description',
        date: yesterday.toLocaleDateString(),
        completed: false,
        overdue: true,
        priority: 'Moderate Priority',
        subtasks: [
          expect.objectContaining({
            id: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            ),
            text: '',
            checked: false,
          }),
        ],
      });

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });

      await waitFor(() => {
        expect(descInput.value).toBe('');
      });

      await waitFor(() => {
        expect(screen.getByText(/none/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Select a date')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByLabelText('subtask item 1')
        ).not.toBeInTheDocument();
      });
    });

    it('clear error with successfull submit', async () => {
      mockAddTask.mockRejectedValueOnce(new Error('Failed to create task'));
      renderComponent();

      const submitButton = screen.getByText(/Create/i);

      fireEvent.click(submitButton);

      await waitFor(() => {
        screen.getByText('Failed to create task please try again');
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Failed to create task please try again')
        ).not.toBeInTheDocument();
      });
    });

    it('submits form with correct data', async () => {
      mockAddTask.mockRejectedValueOnce(new Error('Failed to create task'));
      renderComponent();
      const submitButton = screen.getByText(/Create/i);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to create task please try again')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission Cancel', () => {
    it('clear fields when canceling', async () => {
      renderComponent();
      const nameInput = screen.getByPlaceholderText("What's on your mind");
      fireEvent.change(nameInput, { target: { value: 'New Task' } });

      const descInput = screen.getByPlaceholderText('Add a description');
      fireEvent.change(descInput, { target: { value: 'Task description' } });

      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      const mediumOption = screen.getByText('Moderate Priority');
      fireEvent.click(mediumOption);

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const today = new Date();

      const todayString = today.toDateString();

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(todayString);

      fireEvent.click(dateOption);

      const addSubtask = screen.queryByLabelText('add subtask');

      fireEvent.click(addSubtask);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      const cancelButton = screen.getByText(/Cancel/i);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });

      await waitFor(() => {
        expect(descInput.value).toBe('');
      });

      await waitFor(() => {
        expect(screen.getByText(/none/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Select a date')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByLabelText('subtask item 1')
        ).not.toBeInTheDocument();
      });
    });

    it('clear error when canceling', async () => {
      mockAddTask.mockRejectedValueOnce(new Error('Failed to create task'));
      renderComponent();

      const submitButton = screen.getByText(/Create/i);

      fireEvent.click(submitButton);

      await waitFor(() => {
        screen.getByText('Failed to create task please try again');
      });

      const cancelButton = screen.getByText(/Cancel/i);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Failed to create task please try again')
        ).not.toBeInTheDocument();
      });
    });
  });
});
