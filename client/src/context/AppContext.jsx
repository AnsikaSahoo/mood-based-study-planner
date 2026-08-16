import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <AppContext.Provider value={{ unreadNotifications, setUnreadNotifications, refreshTrigger, triggerRefresh }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
