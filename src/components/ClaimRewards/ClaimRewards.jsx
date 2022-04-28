
import React, { useState, useCallback } from 'react';

import Loader from 'components/Loader';
import useNear from 'services/near'

import styles from './ClaimRewards.module.scss';

const ClaimRewards = () => {
  const { linkAccount, userRewards } = useNear()

  const [isLoading, setIsLoading] = useState(false)

  // TODO: add condition after link created (just withdraw)
  const claimRewards = useCallback(async () => {
    setIsLoading(true)

    await linkAccount()

    setIsLoading(false)
  }, [linkAccount]);

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
