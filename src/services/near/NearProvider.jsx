import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import queryString from 'query-string';

import useStackOverflow from 'services/stackoverflow';

import NearContext from './NearContext';
import { connectWallet, getContract, signIn as nearSignIn, signOut as nearSignOut } from './utils';
import useLinkAccount from './useLinkAccount';
import useBalance from './useBalance';
import useWithdrawTipsTo from './useWithdrawTipsTo';

const NearProvider = ({ children }) => {
  const { userInfo } = useStackOverflow();

  const wallet = useRef(null);
  const contract = useRef(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  const { updateBalance, userRewards } = useBalance({ contract, wallet });
  const linkAccount = useLinkAccount({
    userInfo,
    updateBalance,
    contract,
    accountId: wallet?.account?.()?.accountId,
  });

  const withdrawTips = useCallback(async () => {
    await contract.current.withdraw_tips();

    await updateBalance();
  }, [contract, updateBalance]);

  const withdrawTipsTo = useWithdrawTipsTo({ userInfo, updateBalance });

  useEffect(() => {
    const setup = async () => {
      wallet.current = await connectWallet();
      contract.current = getContract(wallet);

      if (contract.current) {
        const res = await contract.current.get_linked_accounts({account_id: wallet.current.account().accountId});

        setLinkedAccounts(res)
        await updateBalance()
      }
    }

    const parsedQuery = queryString.parse(window.location.search);

    if (parsedQuery.signedNear) {
      window.location.replace(window.location.origin);
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
      isLoggedIn: wallet.current?.isSignedIn?.(),
      accountId: wallet.current?.account?.()?.accountId,
      signIn: () => nearSignIn(wallet),
      signOut: () => {
        nearSignOut(wallet);
        wallet.current = null;
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