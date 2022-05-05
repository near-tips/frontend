import React, { useState, useEffect, useMemo } from 'react'
import queryString from 'query-string'

import useStackOverflow from 'services/stackoverflow'

import NearContext from './NearContext'
import { connectWallet, getContract, signIn as nearSignIn } from './utils'
import useLinkAccount from './useLinkAccount'
import useUpdateBalance from './useUpdateBalance'

const NearProvider = ({ children }) => {
  const { userInfo } = useStackOverflow()

  const [wallet, setWallet] = useState(null)
  const [contract, setContract] = useState(null)
  const [userRewards, setUserRewards] = useState(0)

  const updateBalance = useUpdateBalance({ setUserRewards, contract, wallet })
  const linkAccount = useLinkAccount({
    userInfo,
    setUserRewards,
    contract,
    accountId: wallet?.account?.()?.accountId,
  })

  useEffect(() => {
    connectWallet().then(wallet => {
      setWallet(wallet);
      setContract(getContract(wallet));

      const parsedQuery = queryString.parse(window.location.search);

      if (parsedQuery.signedNear) {
        window.location.replace(window.location.origin);
      }
    })
  }, []);

  useEffect(() => {
    if (userInfo) {
      updateBalance()
    }
  }, [contract])

  const value = useMemo(() => {
    return {
      wallet,
      contract,
      isLoggedIn: wallet?.isSignedIn?.(),
      accountId: wallet?.account?.()?.accountId,
      signIn: () => nearSignIn(wallet),
      userRewards,
      updateBalance,
      linkAccount,
    }
  }, [wallet, contract, userRewards, linkAccount, updateBalance])

  return (
    <NearContext.Provider value={value}>
      {children}
    </NearContext.Provider>
  )
}

export default NearProvider