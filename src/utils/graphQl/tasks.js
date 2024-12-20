import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      name
      description
      date
      completed
      overdue
      priority
      subtasks {
        id
        text
        checked
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $name: String
    $date: String
    $description: String
    $completed: Boolean
    $overdue: Boolean
    $priority: String
    $subtasks: [SubTaskInput]
  ) {
    createTask(
      name: $name
      date: $date
      description: $description
      completed: $completed
      overdue: $overdue
      priority: $priority
      subtasks: $subtasks
    ) {
      id
      name
      date
      description
      completed
      overdue
      priority
      subtasks {
        id
        text
        checked
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $name: String
    $date: String
    $description: String
    $completed: Boolean
    $overdue: Boolean
    $priority: String
    $subtasks: [SubTaskInput]
  ) {
    updateTask(
      id: $id
      name: $name
      date: $date
      description: $description
      completed: $completed
      overdue: $overdue
      priority: $priority
      subtasks: $subtasks
    ) {
      id
      name
      date
      description
      completed
      overdue
      priority
      subtasks {
        id
        text
        checked
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;
