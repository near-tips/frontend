import React, { useEffect, useState, useCallback } from 'react';
import sha512 from 'crypto-js/sha512';
import axios from 'axios';

import Loader from 'components/Loader';

import { USER_INFO_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';

import { yoctoNEARToNear } from './utils';

import styles from './ClaimRewards.module.scss';

const VALIDATORS = [
  'http://165.227.173.249:8081',
  'http://207.154.251.251:8081',
  'http://207.180.249.14:8081',
];

const ClaimRewards = ({ wallet, contract, userInfo }) => {
  const [userRewards, setUserRewards] = useState('-');
  const [isLoading, setIsLoading] = useState(false);
  const { accountId } = wallet.account();
  const { userId, accessToken } = userInfo;

  console.log({ accountId, userId, accessToken }, userId + accessToken + accountId);

  const updateBalance = useCallback(async () => {
    const rewards = await contract.current.get_user_tips({ nickname: String(userId) });

    setUserRewards(yoctoNEARToNear(rewards));
  }, []);

  useEffect(() => {
    updateBalance();
  }, []);

  const claimRewards = useCallback(async () => {
    setIsLoading(true);

    const sha = sha512(userId + accessToken + accountId);

    const commitment_hash = Buffer.from(sha.toString(), 'hex');

    console.log({ commitment_hash }, commitment_hash.length);

    await contract.current.commit_access_token({
      commitment_hash: [...commitment_hash],
    });

    console.log('commitment_hash sent');

    // sign transactions through validators
    const responses = await Promise.allSettled(VALIDATORS.map(validator => {
      return axios.post(`${validator}/v1/trans/sign`, {
        accessToken,
        userId: String(userId),
      });
    }));

    console.log({responses})

    const {
      signatures,
      validator_pks,
    } = responses.reduce((acc, response) => {
      if (response.status === 'fulfilled') {
        const { signature, validatorId } = response.value.data;

        const signatureArrayU8 = [...Buffer.from(signature, 'hex')];

        acc.signatures.push(signatureArrayU8);
        acc.validator_pks.push(validatorId);
      }

      return acc;
    }, {
      signatures: [],
      validator_pks: [],
    });

    console.log({ signatures, validator_pks });

    if (signatures.length > 0) {
      // withdraw rewards
      const response = await contract.current.withdraw_tip_validators({
        nickname: String(userId),
        access_token: accessToken,
        account_id: accountId,
        signatures: signatures,
        validator_pks: validator_pks,
      });

      console.log('claim', {response});

      localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
      updateBalance();
    }

    setIsLoading(false);
  }, []);

  return isLoading ? <Loader className={styles.loader} /> : (
    <div>
      <div className={styles.label}>
        You have rewards: {userRewards} Ⓝ
      </div>
      <button
        onClick={claimRewards}
        disabled={userRewards === '-' || !(userRewards > 0)}
        className={styles.claimRewards}
      >
        Claim Rewards
      </button>
    </div>
  )
};

export default ClaimRewards;
