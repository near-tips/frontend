import React, { useState, useEffect, useRef } from 'react';

import StackOverflowLogin from './StackOverflowLogin';
import NearWalletLogin from './NearWalletLogin';
import ClaimRewards from './ClaimRewards';

import styles from './MainForm.module.scss';

const STACK_OVERFLOW_STAGE = 'stack-overflow-stage';
const NEAR_WALLET_LOGIN_STAGE = 'near-wallet-login-stage';
const CLAIM_REWARDS_STAGE = 'claim-rewards-stage';

const MainForm = () => {
  const [stage, setStage] = useState(STACK_OVERFLOW_STAGE);
  const [userInfo, setUserInfo] = useState(null);
  const [wallet, setWallet] = useState(null);
  const contract = useRef(null);

  useEffect(() => {
    if (userInfo) {
      if (wallet?.isSignedIn?.()) {
        setStage(CLAIM_REWARDS_STAGE);
      } else {
        setStage(NEAR_WALLET_LOGIN_STAGE);
      }
    } else {
      setStage(STACK_OVERFLOW_STAGE);
    }
  }, [userInfo, wallet]);

  return (
    <div className={styles.mainForm}>
      {stage === STACK_OVERFLOW_STAGE && <StackOverflowLogin setUserInfo={setUserInfo} />}

      {stage === NEAR_WALLET_LOGIN_STAGE && (
        <NearWalletLogin
          contract={contract}
          setWallet={setWallet}
          wallet={wallet}
        />
      )}

      {stage === CLAIM_REWARDS_STAGE && (
        <ClaimRewards
          wallet={wallet}
          userInfo={userInfo}
          contract={contract}
        />
      )}
    </div>
  );
}

export default MainForm;
