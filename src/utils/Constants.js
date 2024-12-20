export const defaultSort = {
  field: 'Date', // Default field
  order: 'ascending', // Default order
};

export const defaultFitlersObject = {
  description: false,
  priority: false,
  overdue: true,
  completed: true,
};

export const defaultFitlersArray = [
  { id: 1, name: 'description', visible: false },
  { id: 3, name: 'priority', visible: false },
  { id: 4, name: 'overdue', visible: true },
  { id: 5, name: 'completed', visible: true },
];

export const hideAllFitlersObject = {
  description: false,
  priority: false,
  overdue: false,
  completed: false,
};

export const hideAllFitlersArray = [
  { id: 1, name: 'description', visible: false },
  { id: 3, name: 'priority', visible: false },
  { id: 4, name: 'overdue', visible: false },
  { id: 5, name: 'completed', visible: false },
];

export const options = ['Alphabetical', 'Date', 'Priority'];

export const dateOptions = ['All Time', 'Custom'];

export const colors = { primry: '#597dff', secondary: '#597dff5f' };
