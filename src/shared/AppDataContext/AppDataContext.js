import { createContext } from 'react'

const AppDataContext = createContext({
  isStackOverflowLoggedIn: false,
});

export default AppDataContext;
