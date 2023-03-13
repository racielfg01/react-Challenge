import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();
const initialAlert={open:false,action:2};

export const ContextProvider = ({ children }) => {
  
  const [notifications, setNotifications] = useState([]);
  const [alarmsC, setAlarmsC] = useState([]);
  const [alarmsA, setAlarmsA] = useState([]);
  const [alertC, setAlertC] = useState(initialAlert);


  return (
    <StateContext.Provider
      value={{
         notifications, setNotifications,
         alarmsC, setAlarmsC,
         alarmsA, setAlarmsA,
         alertC, setAlertC
         }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);