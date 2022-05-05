
import React, { useState, useCallback } from 'react';

import Loader from 'components/Loader';
import useNear from 'services/near'

import styles from './ClaimRewards.module.scss';

const ClaimRewards = () => {
  const { linkAccount, userRewards, linkedAccounts, withdrawTips } = useNear()

  const [isLoading, setIsLoading] = useState(false)

  const claimRewards = useCallback(async () => {
    setIsLoading(true)

    // TODO: change for more services
    if (linkedAccounts.length === 0) {
      await linkAccount()
    } else {
      await withdrawTips()
    }

    setIsLoading(false)
  }, [linkAccount, linkedAccounts]);

  return isLoading ? <Loader className={styles.loader} /> : (
    <button
      onClick={claimRewards}
      disabled={userRewards === 0}
      className={styles.claimRewards}
    >
      Claim Rewards
    </button>
  )
};

export default ClaimRewards;
