import { createContext } from 'react'

const StackOverflowContext = createContext({
  isLoggedIn: false,
  userInfo: null,
})

export default StackOverflowContext