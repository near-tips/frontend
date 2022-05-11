import { createContext } from 'react'

const NearContext = createContext({
  wallet: null,
  contract: null,
  isLoggedIn: false,
  accountId: '',
  signIn: () => {},
  signOut: () => {},
  userRewards: 0,
  updateBalance: () => {},
  linkAccount: () => {},
  linkedAccounts: [],
  withdrawTips: () => {},
  withdrawTipsTo: () => {},
})

export default NearContext