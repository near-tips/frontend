import React, { useState, useEffect, useMemo, useCallback } from 'react';
import queryString from 'query-string';

import useStackOverflow from 'services/stackoverflow';

import NearContext from './NearContext';
import { connectWallet, getContract, signIn as nearSignIn, signOut as nearSignOut } from './utils';
import useLinkAccount from './useLinkAccount';
import useUpdateBalance from './useUpdateBalance';
import useWithdrawTipsTo from './useWithdrawTipsTo';

const NearProvider = ({ children }) => {
  const { userInfo } = useStackOverflow()

  const [wallet, setWallet] = useState(null)
  const [contract, setContract] = useState(null)
  const [userRewards, setUserRewards] = useState(0)
  const [linkedAccounts, setLinkedAccounts] = useState([])

  const updateBalance = useUpdateBalance({ setUserRewards, contract, wallet });
  const linkAccount = useLinkAccount({
    userInfo,
    setUserRewards,
    contract,
    accountId: wallet?.account?.()?.accountId,
  });

  const withdrawTips = useCallback(async () => {
    await contract.withdraw_tips();

    // TODO: use updateBalance after to show true value
    setUserRewards(0);
  }, [contract]);

  const withdrawTipsTo = useWithdrawTipsTo({ userInfo, setUserRewards, contract });

  useEffect(() => {
    const setup = async () => {
      const wallet = await connectWallet();

      const contract = getContract(wallet);

      setWallet(wallet);
      setContract(contract);

      if (contract) {
        const res = await contract.get_linked_accounts({account_id: wallet.account().accountId});

        setLinkedAccounts(res)
        updateBalance()
      }

      const parsedQuery = queryString.parse(window.location.search);

      if (parsedQuery.signedNear) {
        window.location.replace(window.location.origin);
      }
    }

    setup().catch(console.error)
  }, []);

  useEffect(() => {
    if (userInfo) {
      updateBalance()
    }
  }, [userInfo])

  const value = useMemo(() => {
    return {
      wallet,
      contract,
      isLoggedIn: wallet?.isSignedIn?.(),
      accountId: wallet?.account?.()?.accountId,
      signIn: () => nearSignIn(wallet),
      signOut: () => {
        nearSignOut(wallet);
        setWallet(null);
      },
      userRewards,
      updateBalance,
      linkAccount,
      linkedAccounts,
      withdrawTips,
      withdrawTipsTo,
    }
  }, [wallet, contract, userRewards, linkAccount, updateBalance, linkedAccounts, withdrawTips, withdrawTipsTo])

  return (
    <NearContext.Provider value={value}>
      {children}
    </NearContext.Provider>
  )
}

export default NearProvider