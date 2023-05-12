import React, { createContext, useState} from 'react';

export const TaskContext = createContext();

const TaskContextProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
