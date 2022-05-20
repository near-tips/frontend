import React from 'react'
import cn from 'classnames'

import useNear from 'services/near'
import ClaimRewards from 'components/ClaimRewards'
import NearWalletLogin from 'components/NearWalletLogin'
import WithdrawTo from 'components/WithdrawTo';
import useStackOverflow from 'services/stackoverflow';

import styles from './Rewards.module.scss'
import sceneStyles from '../scenes.module.scss'

const Rewards = ({ className }) => {
  const { userRewards, isLoggedIn, linkedAccounts } = useNear()
  const { isLoggedIn: stLoggedIn } = useStackOverflow();

  return (
    <div className={cn([className, styles.rewards])}>
      <div className={sceneStyles.label}>
        Your unclaimed tips: {userRewards} Ⓝ
      </div>

      <div className={sceneStyles.content}>
        <div className={styles.label}>
          Connect Near Wallet & Claim rewards <br/> <span className={styles.commission}>(1% commission)</span>
        </div>

        {!isLoggedIn && <NearWalletLogin />}
        {isLoggedIn && <ClaimRewards />}
      </div>

      {
        stLoggedIn && linkedAccounts.length === 0 && (
          <div className={sceneStyles.content}>
            <div className={styles.label}>
              Withdraw to any Near wallet <br/> <span className={styles.commission}>(5% commission)</span>
            </div>

            <WithdrawTo />
          </div>
        )
      }
    </div>
  )
}

export default Rewards
