import React, { useEffect, useCallback } from 'react';
import queryString from 'query-string';

import { connectWallet, signIn, getContract } from 'utils/nearUtils';

import styles from './NearWalletLogin.module.scss';

const NearWalletLogin = ({ setWallet, contract, wallet }) => {
  useEffect(() => {
    connectWallet().then(wallet => {
      setWallet(wallet);

      contract.current = getContract(wallet);

      const parsedQuery = queryString.parse(window.location.search);

      if (parsedQuery.signedNear) {
        window.location.replace(window.location.origin);
      }
    })
  }, []);

  const handleClick = useCallback(() => {
    if (!wallet.isSignedIn()) {
      signIn(wallet);
    }
  }, [wallet]);

  return (
    <button
      className={styles.nearButton}
      onClick={handleClick}
    >
      Login with Near
    </button>
  )
}

export default NearWalletLogin;
