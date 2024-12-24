import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../components/home/TaskItem';

const mockEditTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockSetSelectedItem = jest.fn();

const defualtItem = {
  completed: false,
  date: new Date().toLocaleDateString(),
  description: 'test description',
  id: '675066a648bd750e99bf688e',
  name: 'test name',
  overdue: false,
  priority: 'Low',
  subtasks: [
    {
      id: '2024-12-04T14:26:41.185Z',
      text: '',
      checked: false,
    },
  ],
};

let mockSelectedItem;

jest.mock('../contexts/TaskContext', () => ({
  useTaskContext: () => ({
    editTask: mockEditTask,
    deleteTask: mockDeleteTask,
    scrollBarWidth: 0,
    windowSize: { height: 500 },
  }),
}));

const renderComponent = () => {
  return render(
    <TaskItem
      selectedItem={mockSelectedItem}
      setSelectedItem={mockSetSelectedItem}
      setVisibleSection={jest.fn()}
    />
  );
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    mockSelectedItem = defualtItem;
    jest.clearAllMocks();
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    delete global.ResizeObserver; // Clean up after each test
  });

  describe('Item Rendering', () => {
    it('renders all item elements correctly', async () => {
      renderComponent();
      expect(screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Add Subtask/i)).toBeInTheDocument();

      const optionsButton = await screen.findByLabelText(
        `${mockSelectedItem.name} options`
      );

      const subtaskCheckbox1 = await screen.findByLabelText(
        `subtask 1 checkbox`
      );
      const subtaskInput1 = await screen.findByLabelText(`subtask 1 input`);
      const subtasDeleteButton1 = await screen.findByLabelText(
        `subtask 1 delete button`
      );

      expect(optionsButton).toBeInTheDocument();
      expect(subtaskCheckbox1).toBeInTheDocument();
      expect(subtaskInput1).toBeInTheDocument();
      expect(subtasDeleteButton1).toBeInTheDocument();

      expect(screen.queryByLabelText('error message')).not.toBeInTheDocument();
    });
  });

  describe('Item Changes', () => {
    it('complete item correctly', async () => {
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockSelectedItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          completed: true,
        });
      });
    });

    it('uncomplete item correctly', async () => {
      mockSelectedItem = {
        ...defualtItem,
        completed: true,
      };

      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockSelectedItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          completed: false,
        });
      });
    });

    it('updates item name correctly', async () => {
      renderComponent();
      const nameInput = screen.getByLabelText(/Task Name/i);
      fireEvent.change(nameInput, {
        target: { value: nameInput.value + ' value' },
      });

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          name: 'test name value',
        });
      });
    });

    it('updates item description correctly', async () => {
      renderComponent();
      const descriptionInput = screen.getByLabelText(/Description/i);
      fireEvent.change(descriptionInput, {
        target: { value: descriptionInput.value + ' value' },
      });

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          description: 'test description value',
        });
      });
    });

    it('updates item priority correctly', async () => {
      renderComponent();

      const priorityDropdown = screen.getByLabelText(/Priority/i);
      fireEvent.click(priorityDropdown);

      const mediumOption = screen.getByText('Moderate Priority');
      fireEvent.click(mediumOption);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          priority: 'Moderate Priority',
        });
      });
    });

    it('update item date to tomorrow correctly', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(tomorrow.toDateString());

      fireEvent.click(dateOption);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          date: tomorrow.toLocaleDateString(),
        });
      });
    });

    it('update item date to yesyerday correctly', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/due date/i);
      fireEvent.click(dateInput);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Wait for the element with the matching aria-label to appear
      const dateOption = await screen.findByLabelText(yesterday.toDateString());

      fireEvent.click(dateOption);

      const setDateButton = screen.getByText('Set');
      fireEvent.click(setDateButton);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          date: yesterday.toLocaleDateString(),
          overdue: true,
        });
      });
    });

    it('add subtask correctly', async () => {
      renderComponent();
      const addSubtask = screen.getByLabelText('add subtask');
      fireEvent.click(addSubtask);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          subtasks: [
            expect.objectContaining({
              id: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
              ),
              text: '',
              checked: false,
            }),
            {
              id: '2024-12-04T14:26:41.185Z',
              text: '',
              checked: false,
            },
          ],
        });
      });
    });

    it('complete subtask correctly', async () => {
      renderComponent();

      const subtaskCheckbox1 = await screen.findByLabelText(
        `subtask 1 checkbox`
      );

      fireEvent.click(subtaskCheckbox1);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,

          subtasks: [
            {
              id: '2024-12-04T14:26:41.185Z',
              text: '',
              checked: true,
            },
          ],
        });
      });
    });

    it('uncomplete subtask correctly', async () => {
      mockSelectedItem = {
        ...defualtItem,
        subtasks: [
          {
            id: '2024-12-04T14:26:41.185Z',
            text: '',
            checked: true,
          },
        ],
      };

      renderComponent();

      const subtaskCheckbox1 = await screen.findByLabelText(
        `subtask 1 checkbox`
      );

      fireEvent.click(subtaskCheckbox1);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          subtasks: [
            {
              id: '2024-12-04T14:26:41.185Z',
              text: '',
              checked: false,
            },
          ],
        });
      });
    });

    it('write subtask correctly', async () => {
      renderComponent();

      const subtaskInput1 = await screen.findByLabelText(`subtask 1 input`);

      fireEvent.change(subtaskInput1, {
        target: { value: 'test' },
      });

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          subtasks: [
            {
              id: '2024-12-04T14:26:41.185Z',
              text: 'test',
              checked: false,
            },
          ],
        });
      });
    });

    it('delete subtask correctly', async () => {
      renderComponent();

      const subtasDeleteButton1 = await screen.findByLabelText(
        `subtask 1 delete button`
      );

      fireEvent.click(subtasDeleteButton1);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockSelectedItem,
          subtasks: [],
        });
      });
    });

    it('edit item failiure', async () => {
      mockEditTask.mockRejectedValueOnce(new Error('Failed to edit task'));
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockSelectedItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to edit task please try again')
        ).toBeInTheDocument();
      });
    });

    it('clear edit item failiure', async () => {
      mockEditTask.mockRejectedValueOnce(new Error('Failed to edit task'));
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockSelectedItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        screen.getByText('Failed to edit task please try again');
      });

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(
          screen.queryByText('Failed to edit task please try again')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('delete item', () => {
    it('delete item correctly', async () => {
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockSelectedItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockSelectedItem.name} delete item`
      );

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith(`${mockSelectedItem.id}`);
      });
      await waitFor(() => {
        expect(mockSetSelectedItem).toHaveBeenCalledWith(null);
      });
    });

    it('options blur', async () => {
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockSelectedItem.name} options`
      );

      fireEvent.click(optionsButton);

      fireEvent.blur(optionsButton);

      await waitFor(() => {
        expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
      });
    });

    it('delete item failiure', async () => {
      mockDeleteTask.mockRejectedValueOnce(new Error('Failed to delete task'));
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockSelectedItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockSelectedItem.name} delete item`
      );

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to delete task please try again')
        ).toBeInTheDocument();
      });
    });

    it('clear delete item failiure', async () => {
      mockDeleteTask.mockRejectedValueOnce(new Error('Failed to delete task'));
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockSelectedItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockSelectedItem.name} delete item`
      );

      fireEvent.click(deleteButton);

      await waitFor(() => {
        screen.getByText('Failed to delete task please try again');
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Failed to delete task please try again')
        ).not.toBeInTheDocument();
      });
    });
  });
});
