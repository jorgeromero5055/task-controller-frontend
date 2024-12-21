import React, { createContext, useState, useContext, useEffect } from 'react';

import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASKS,
  UPDATE_TASK,
} from '../utils/graphQl/tasks';
import { useMutation, useQuery } from '@apollo/client';

const defaultFitlers = {
  description: false,
  priority: false,
  overdue: true,
  completed: true,
};

const defaultSort = {
  field: 'Date',
  order: 'Ascending',
};

const sanitizeSubtasks = (tasks) => {
  return tasks.map((task) => {
    if (task.subtasks && task.subtasks.length !== 0) {
      return {
        ...task, // Create a shallow copy of the task
        subtasks: task.subtasks.map(({ __typename, ...rest }) => rest), // Map and sanitize subtasks
      };
    }
    return { ...task }; // Return a shallow copy of the task if no subtasks
  });
};

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sortOptions, setSortOptions] = useState(defaultSort);
  const [shownItems, setShownItems] = useState(defaultFitlers);
  const [listDate, setListDate] = useState({
    allTime: true,
    custom: {
      from: new Date(),
      to: null,
    },
  });
  const [loadingState, setLoadingState] = useState('loading');
  const { loading, error, data, refetch } = useQuery(GET_TASKS);

  const loadTasks = async () => {
    try {
      const { data } = await refetch();
      const list = data.getTasks || [];
      const sanitizedList = sanitizeSubtasks(list);
      setTasks(sanitizedList);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const [createTask] = useMutation(CREATE_TASK);
  const addTask = async (newItem) => {
    try {
      const { data } = await createTask({ variables: newItem });
      if (data.createTask.subtasks.length !== 0) {
        const sanitizedSubtasks = data.createTask.subtasks.map(
          ({ __typename, ...rest }) => rest
        );
        data.createTask.subtasks = sanitizedSubtasks;
      }
      setTasks((prevTasks) => [...prevTasks, data.createTask]);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const [updateTask] = useMutation(UPDATE_TASK);
  const editTask = async (newData) => {
    try {
      await updateTask({ variables: newData });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === newData.id ? { ...task, ...newData } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const [removeTask] = useMutation(DELETE_TASK);
  const deleteTask = async (id) => {
    try {
      await removeTask({ variables: { id: id } });
      setTasks((list) => list.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (data?.getTasks) {
      setLoadingState('success');
      const list = data.getTasks || [];
      const sanitizedList = sanitizeSubtasks(list);
      setTasks(sanitizedList);
    } else if (error) {
      console.error(error.message);
      throw error;
    }
  }, [loading, data, error]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contextValue = {
    tasks,
    sortOptions,
    setSortOptions,
    shownItems,
    setShownItems,
    listDate,
    setListDate,
    loadingState,
    loadTasks,
    addTask,
    editTask,
    deleteTask,
    windowSize,
    isTouch: window.matchMedia('(pointer: coarse)').matches,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
