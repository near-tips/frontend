import React, { useMemo, useState, useCallback } from 'react'

import useStackOverflow from 'services/stackoverflow';
import useNear from 'services/near';

import styles from './WithdrawTo.module.scss'

const WithdrawTo = () => {
  const [address, setAddress] = useState('');

  const { isLoggedIn } = useStackOverflow();
  const { userRewards, linkedAccounts, withdrawTipsTo } = useNear();

  const handleAddressChange = useCallback((ev) => {
    setAddress(ev.target.value);
  }, []);
  const withdrawTo = useCallback(() => {
    withdrawTipsTo(address);
  }, [address]);

  const isDisabled = useMemo(() => {
    return !isLoggedIn || userRewards === 0 || linkedAccounts.length > 0;
  }, [isLoggedIn, userRewards, linkedAccounts]);

  return (
    <div className={styles.withdrawTo}>
      <input
        className={styles.addressInput}
        type="text"
        onChange={handleAddressChange}
      />
      <button
        className={styles.button}
        disabled={isDisabled}
        onClick={withdrawTo}
      >
        Withdraw
      </button>
    </div>
  )
};

export default WithdrawTo