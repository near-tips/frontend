import React, { useState, useMemo } from 'react';

import AppDataContext from './AppDataContext';

const AppDataProvider = ({ children }) => {
  const [isStackOverflowLoggedIn, setIsStackOverflowLoggedIn] = useState(false)

  // data logic

  const value = useMemo(() => {
    return {
      isStackOverflowLoggedIn,
    }
  }, [isStackOverflowLoggedIn]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

export default AppDataProvider