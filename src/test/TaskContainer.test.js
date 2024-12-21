import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskContainer from '../components/home/TaskContainer';
import { daysAgo } from '../utils/helpers';

const defaultMockItems = [
  {
    completed: false,
    date: new Date().toLocaleDateString(),
    description: 'test description upcoming 2',
    id: '674f82edf177f2aeb316eb02',
    name: 'test name upcoming 2',
    overdue: false,
    priority: 'none',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
  {
    completed: false,
    date: new Date(
      new Date().setDate(new Date().getDate() - 2)
    ).toLocaleDateString(),
    description: 'test description overdue 2',
    id: '674f82edf177f2aeb316eb06',
    name: 'test name overdue 2',
    overdue: true,
    priority: 'none',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
  {
    completed: true,
    date: new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toLocaleDateString(),
    description: 'test description complete 2',
    id: '674f82edf177f2aeb316eb04',
    name: 'test name completed 2',
    overdue: false,
    priority: 'none',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
  {
    completed: false,
    date: new Date().setDate(new Date().getDate() + 1),
    description: 'test description upcoming 1',
    id: '674f82edf177f2aeb316eb01',
    name: 'test name upcoming 1',
    overdue: false,
    priority: 'Low',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
  {
    completed: false,
    date: new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toLocaleDateString(),
    description: 'test description overdue 1',
    id: '674f82edf177f2aeb316eb05',
    name: 'test name overdue 1',
    overdue: true,
    priority: 'Medium',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
  {
    completed: true,
    date: new Date().toLocaleDateString(),
    description: 'test description complete 1',
    id: '674f82edf177f2aeb316eb03',
    name: 'test name completed 1',
    overdue: false,
    priority: 'Top',
    subtasks: [{ checked: false, id: '2024-12-04T12:00:59.367Z', text: '' }],
  },
];

const defaultListDate = {
  allTime: true,
  custom: {
    from: new Date(),
    to: null,
  },
};

const defaultSortItems = {
  field: 'Date',
  order: 'Ascending',
};

const defaultShownItems = {
  description: false,
  priority: false,
  overdue: true,
  completed: true,
};

let mockTasks;
let mockListDate;
let mockSortOptions;
let mockShownItems;
let mockSearchQuery;

jest.mock('../contexts/TaskContext', () => ({
  useTaskContext: () => ({
    tasks: mockTasks,
    loadingState: false,
    listDate: mockListDate,
    sortOptions: mockSortOptions,
    shownItems: mockShownItems,
  }),
}));

const renderComponent = () => {
  return render(
    <TaskContainer
      selectedItem={null}
      setSelectedItem={jest.fn()}
      searchQuery={mockSearchQuery}
    />
  );
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    mockTasks = defaultMockItems;
    mockSortOptions = defaultSortItems;
    mockShownItems = defaultShownItems;
    mockSearchQuery = '';
    mockListDate = defaultListDate;

    jest.clearAllMocks();

    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    delete global.IntersectionObserver; // Clean up after each test
  });

  describe('Container Rendering', () => {
    it('renders container list correctly', async () => {
      renderComponent();

      const upcomingHeader = screen.getByText('Upcoming');
      const upcomingItemName = screen.getByText('test name upcoming 1');

      expect(
        upcomingHeader.compareDocumentPosition(upcomingItemName) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdueHeader = screen.getByText('Overdue');
      const overdueItemName = screen.getByText('test name overdue 1');

      expect(
        overdueHeader.compareDocumentPosition(overdueItemName) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const completedHeader = screen.getByText('Completed');
      const completedItemName = screen.getByText('test name completed 1');

      expect(
        completedHeader.compareDocumentPosition(completedItemName) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  // Alphabetical Priority Date Ascending Descending
  describe('Sort List', () => {
    it('sort alphabetically in ascending order', async () => {
      mockSortOptions = { ...mockSortOptions, field: 'Alphabetical' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming1.compareDocumentPosition(upcoming2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue1.compareDocumentPosition(overdue2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete1.compareDocumentPosition(complete2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('sort alphabetically in descending order', async () => {
      mockSortOptions = { field: 'Alphabetical', order: 'Descending' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming2.compareDocumentPosition(upcoming1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue2.compareDocumentPosition(overdue1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete2.compareDocumentPosition(complete1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('sort priority in ascending order', async () => {
      mockSortOptions = { ...mockSortOptions, field: 'Priority' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming2.compareDocumentPosition(upcoming1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue2.compareDocumentPosition(overdue1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete2.compareDocumentPosition(complete1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('sort priority in descending order', async () => {
      mockSortOptions = { field: 'Priority', order: 'Descending' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming1.compareDocumentPosition(upcoming2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue1.compareDocumentPosition(overdue2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete1.compareDocumentPosition(complete2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('sort date in ascending order', async () => {
      mockSortOptions = { ...mockSortOptions, field: 'Date' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming2.compareDocumentPosition(upcoming1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue2.compareDocumentPosition(overdue1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete2.compareDocumentPosition(complete1) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('sort date in descending order', async () => {
      mockSortOptions = { field: 'Date', order: 'Descending' };
      renderComponent();

      const upcoming1 = screen.getByText('test name upcoming 1');
      const upcoming2 = screen.getByText('test name upcoming 2');

      expect(
        upcoming1.compareDocumentPosition(upcoming2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const overdue1 = screen.getByText('test name overdue 1');
      const overdue2 = screen.getByText('test name overdue 2');

      expect(
        overdue1.compareDocumentPosition(overdue2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();

      const complete1 = screen.getByText('test name completed 1');
      const complete2 = screen.getByText('test name completed 2');

      expect(
        complete1.compareDocumentPosition(complete2) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  describe('Show/Hide Content', () => {
    it('hide overdue list', async () => {
      mockShownItems = { ...mockShownItems, overdue: false };
      renderComponent();
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
      expect(screen.queryByText('test name overdue 1')).not.toBeInTheDocument();
    });

    it('hide completed list', async () => {
      mockShownItems = { ...mockShownItems, completed: false };
      renderComponent();

      expect(screen.queryByText('Completed')).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 1')
      ).not.toBeInTheDocument();
    });

    it('Show list item description', async () => {
      mockShownItems = { ...mockShownItems, description: true };
      renderComponent();

      expect(
        screen.getByText('test description upcoming 1')
      ).toBeInTheDocument();

      expect(
        screen.getByText('test description overdue 1')
      ).toBeInTheDocument();

      expect(
        screen.getByText('test description complete 1')
      ).toBeInTheDocument();
    });

    it('Show list item priority', async () => {
      mockShownItems = { ...mockShownItems, priority: true };
      renderComponent();
      expect(screen.getByText('Low Priority')).toBeInTheDocument();
      expect(screen.getByText('Medium Priority')).toBeInTheDocument();
      expect(screen.getByText('Top Priority')).toBeInTheDocument();
    });
  });

  describe('Filter List', () => {
    it('filters list by search', async () => {
      mockSearchQuery = '1';
      renderComponent();

      expect(screen.getByText('test name upcoming 1')).toBeInTheDocument();
      expect(screen.getByText('test name overdue 1')).toBeInTheDocument();
      expect(screen.getByText('test name completed 1')).toBeInTheDocument();

      expect(
        screen.queryByText('test name upcoming 2')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('test name overdue 2')).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 2')
      ).not.toBeInTheDocument();
    });

    it('filters list by single day', async () => {
      mockListDate = {
        allTime: false,
        custom: {
          from: new Date(),
          to: null,
        },
      };

      renderComponent();

      expect(screen.getByText('test name upcoming 2')).toBeInTheDocument();
      expect(screen.getByText('test name completed 1')).toBeInTheDocument();
      expect(screen.getByText('test name overdue 1')).toBeInTheDocument();
      expect(screen.getByText('test name overdue 2')).toBeInTheDocument();

      expect(
        screen.queryByText('test name upcoming 1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 2')
      ).not.toBeInTheDocument();
    });

    it('filters list by date range', async () => {
      mockListDate = {
        allTime: false,
        custom: {
          from: daysAgo(-1, 3),
          to: daysAgo(-1, 2),
        },
      };

      renderComponent();

      expect(screen.getByText('test name overdue 2')).toBeInTheDocument();

      expect(
        screen.queryByText('test name upcoming 1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name upcoming 2')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('test name overdue 1')).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 2')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 2')
      ).not.toBeInTheDocument();
    });
  });

  describe('Paginate Completed List', () => {
    it('limit Complete list to 5 items', async () => {
      for (let i = 1; i <= 8; i++) {
        mockTasks.push({
          ...mockTasks[5],

          description: `test description complete ${2 + i}`,
          name: `test name completed ${2 + i}`,
          id: `674f82edf177f2aeb316eb0${6 + i}`,
        });
      }
      renderComponent();
      expect(screen.getByText('Show more')).toBeInTheDocument();

      expect(screen.getByText('test name completed 5')).toBeInTheDocument();
      expect(
        screen.queryByText('test name completed 6')
      ).not.toBeInTheDocument();
    });

    it('show more than 5 completed items', async () => {
      for (let i = 1; i <= 8; i++) {
        mockTasks.push({
          ...mockTasks[5],

          description: `test description complete ${2 + i}`,
          name: `test name completed ${2 + i}`,
          id: `674f82edf177f2aeb316eb0${6 + i}`,
        });
      }
      renderComponent();

      const showMoreButton = screen.queryByText('Show more');

      fireEvent.click(showMoreButton);

      await waitFor(async () => {
        expect(screen.getByText('test name completed 6')).toBeInTheDocument();
      });

      await waitFor(async () => {
        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
      });
    });
  });
});
