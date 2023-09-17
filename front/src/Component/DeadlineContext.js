// DeadlineContext.js
import React, { createContext, useContext, useState } from 'react';

const DeadlineContext = createContext();

export const useDeadlineContext = () => useContext(DeadlineContext);

export const DeadlineProvider = ({ children }) => {
  const [deadline, setDeadline] = useState("");

  return (
    <DeadlineContext.Provider value={{ deadline, setDeadline }}>
      {children}
    </DeadlineContext.Provider>
  );
};
