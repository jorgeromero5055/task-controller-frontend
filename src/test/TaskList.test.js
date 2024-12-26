import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../components/home/TaskList';

const returnUseNavigate = jest.fn();
const useNavigateReturn = () => {
  return returnUseNavigate;
};

jest.mock('react-router-dom', () => {
  return {
    useNavigate: useNavigateReturn,
  };
});

let mockItem;
let mockShownItems;
let mockSelectedItem;

const defualtItem = {
  completed: false,
  date: new Date().toLocaleDateString(),
  description: 'test description 1',
  id: '674f82edf177f2aeb316eb01',
  name: 'test name 1',
  overdue: false,
  priority: 'Moderate Priority',
  subtasks: [
    {
      id: '2024-12-04T14:26:41.185Z',
      text: '',
      checked: false,
    },
  ],
};

const defaultShownItems = {
  description: false,
  priority: false,
};

const mockEditTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockSetSelectedItem = jest.fn();

jest.mock('../contexts/TaskContext', () => ({
  useTaskContext: () => ({
    editTask: mockEditTask,
    deleteTask: mockDeleteTask,
    shownItems: mockShownItems,
    isTouch: false,
  }),
}));

const renderComponent = () => {
  return render(
    <TaskList
      list={[mockItem]}
      type="Completed"
      selectedItem={mockSelectedItem}
      setSelectedItem={mockSetSelectedItem}
    />
  );
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    mockItem = defualtItem;
    mockShownItems = defaultShownItems;
    jest.clearAllMocks();
  });

  describe('List Rendering', () => {
    it('renders item elements correctly', async () => {
      renderComponent();

      await waitFor(async () => {
        expect(screen.getByText('test name 1')).toBeInTheDocument();
      });
      await waitFor(async () => {
        expect(
          screen.getByText(new Date().toLocaleDateString())
        ).toBeInTheDocument();
      });
      await waitFor(async () => {
        expect(
          screen.getByLabelText(/Test Name 1 Item Checkbox/i)
        ).toBeInTheDocument();
      });
      await waitFor(async () => {
        expect(
          screen.getByLabelText(/Test Name 1 Options/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Update Item', () => {
    it('checks item', async () => {
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockItem,
          completed: true,
        });
      });
    });

    it('un checks item', async () => {
      mockItem = { ...mockItem, completed: true };
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockItem,
          completed: false,
        });
      });
    });

    it('checks overdue item', async () => {
      mockItem = {
        ...mockItem,
        date: new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toLocaleDateString(),
        overdue: true,
      };

      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockItem,
          completed: true,
          overdue: false,
        });
      });
    });

    it('un checks overdue item', async () => {
      mockItem = {
        ...mockItem,
        completed: true,
        date: new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toLocaleDateString(),
      };
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(mockEditTask).toHaveBeenCalledWith({
          ...mockItem,
          completed: false,
          overdue: true,
        });
      });
    });

    it('show item description', async () => {
      mockShownItems = { ...mockShownItems, description: true };
      renderComponent();

      expect(screen.getByText('test description 1')).toBeInTheDocument();
    });

    it('show item priority', async () => {
      mockShownItems = { ...mockShownItems, priority: true };
      renderComponent();

      expect(screen.getByText('Moderate Priority')).toBeInTheDocument();
    });

    it('select item', async () => {
      renderComponent();

      const listItem = await screen.findByLabelText(
        `${mockItem.name} list item`
      );
      fireEvent.click(listItem);

      await waitFor(() => {
        expect(mockSetSelectedItem).toHaveBeenCalledWith(mockItem);
      });
    });

    it('edit item faliure', async () => {
      mockEditTask.mockRejectedValueOnce(new Error('Failed to edit task'));
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
      );

      fireEvent.click(itemCheckbox);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to edit task please try again')
        ).toBeInTheDocument();
      });
    });

    it('clear item faliure', async () => {
      mockEditTask.mockRejectedValueOnce(new Error('Failed to edit task'));
      renderComponent();

      const itemCheckbox = await screen.findByLabelText(
        `${mockItem.name} item checkbox`
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

  describe('Delete Item', () => {
    it('delete item success', async () => {
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockItem.name} delete item`
      );

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith(mockItem.id);
      });
    });

    it('options blur', async () => {
      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockItem.name} options`
      );

      fireEvent.click(optionsButton);

      fireEvent.blur(optionsButton);

      await waitFor(() => {
        expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
      });
    });

    it('delete item faliure', async () => {
      mockDeleteTask.mockRejectedValueOnce(new Error('Failed to delete task'));

      renderComponent();

      const optionsButton = await screen.findByLabelText(
        `${mockItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockItem.name} delete item`
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
        `${mockItem.name} options`
      );

      fireEvent.click(optionsButton);

      const deleteButton = await screen.findByLabelText(
        `${mockItem.name} delete item`
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
