import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  
  const [notifications, setNotifications] = useState([]);
  const [alarmsC, setAlarmsC] = useState([]);
  const [alarmsA, setAlarmsA] = useState([]);

  return (
    <StateContext.Provider
      value={{
         notifications, setNotifications,
         alarmsC, setAlarmsC,
         alarmsA, setAlarmsA
         }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);