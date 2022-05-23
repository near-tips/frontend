import React, { useState, useEffect, useMemo, useCallback } from 'react';
import queryString from 'query-string';
import { toast } from 'react-toastify';

import useStackOverflow from 'services/stackoverflow';
import logger from 'utils/logger';

import NearContext from './NearContext';
import { connectWallet, getContract, signIn as nearSignIn, signOut as nearSignOut } from './utils';
import useLinkAccount from './useLinkAccount';
import useBalance from './useBalance';
import useWithdrawTipsTo from './useWithdrawTipsTo';

const NearProvider = ({ children }) => {
  const { userInfo } = useStackOverflow();

  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  const { updateBalance, userRewards } = useBalance({ contract, wallet, linkedAccounts });
  const linkAccount = useLinkAccount({
    userInfo,
    updateBalance,
    contract,
    accountId: wallet?.account?.()?.accountId,
    userRewards,
  });

  const withdrawTips = useCallback(async () => {
    await toast.promise(
      contract.withdraw_tips(),
      {
        pending: `Withdraw pending...`,
        success: `${userRewards} Ⓝ sent to your wallet.`,
        error: {
          render({ error }) {
            logger.error('Linked withdraw tips problem', error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );

    await updateBalance();
  }, [contract, updateBalance]);

  const withdrawTipsTo = useWithdrawTipsTo({ userInfo, updateBalance, userRewards });

  useEffect(() => {
    const setup = async () => {
      const wallet = await connectWallet();
      const contract = getContract(wallet);

      setWallet(wallet);
      setContract(contract);

      if (wallet.isSignedIn()) {
        const res = await contract.get_linked_accounts({ account_id: wallet.account().accountId });

        setLinkedAccounts(res);
      }
    }

    const parsedQuery = queryString.parse(window.location.search);

    if (parsedQuery.signedNear) {
      window.location.replace(window.location.origin);
    }

    setup().catch(logger.error)
  }, []);

  const value = useMemo(() => {
    return {
      wallet,
      contract,
      isLoggedIn: wallet?.isSignedIn?.(),
      accountId: wallet?.account?.()?.accountId,
      signIn: () => nearSignIn(wallet),
      signOut: () => {
        nearSignOut(wallet);
        setContract(null);
        setLinkedAccounts([]);
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