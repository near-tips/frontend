import { createContext } from 'react'

const NearContext = createContext({
  wallet: null,
  contract: null,
  isLoggedIn: false,
  accountId: '',
  signIn: () => {},
  userRewards: 0,
  updateBalance: () => {},
  linkAccount: () => {},
  linkedAccounts: [],
  withdrawTips: () => {},
})

export default NearContext