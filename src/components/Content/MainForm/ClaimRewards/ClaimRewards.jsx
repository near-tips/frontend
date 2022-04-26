
import React, { useEffect, useState, useCallback } from 'react';
import sha512 from 'crypto-js/sha512';
import cryptoJs from 'crypto-js';
import axios from 'axios';

import Loader from 'components/Loader';

import { USER_INFO_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';

import { yoctoNEARToNear, Service, hashToU8Array } from './utils';

import styles from './ClaimRewards.module.scss';

const VALIDATORS = [
  'https://val1.near-tips.com',
  'https://val2.near-tips.com',
];

function toHex(str) {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

const ClaimRewards = ({ wallet, contract, userInfo }) => {
  const [userRewards, setUserRewards] = useState('-');
  const [isLoading, setIsLoading] = useState(false);
  const { accountId } = wallet.account();
  const { userId, accessToken } = userInfo;

  console.log({ accountId, userId, accessToken }, userId + accessToken + accountId);

  const updateBalance = useCallback(async () => {
    const rewards = await contract.current.get_service_id_tips({
      service_id: {
        service: Service.stackOverflow,
        id: String(userId),
      }
    });

    setUserRewards(yoctoNEARToNear(rewards));
  }, [userId]);

  useEffect(() => {
    updateBalance();
  }, []);

  const claimRewards = useCallback(async () => {
    setIsLoading(true);

    const access_token_hash = sha512(accessToken);
    // const access_token_2hash = sha512(access_token_hash);
    // const account_id_hex = toHex(accountId);
    // const account_id_commitment = sha512(cryptoJs.enc.Hex.parse(account_id_hex + access_token_hash));

    // const a = await contract.current.authentification_commitment({
    //   access_token_2hash: hashToU8Array(access_token_2hash),
    //   account_id_commitment: hashToU8Array(account_id_commitment),
    // }, DEFAULT_GAS, utils.format.parseNearAmount('0.005'))

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
      validators_pks,
      deadline,
    } = responses.reduce((acc, response) => {
      if (response.status === 'fulfilled') {
        const { signature, validatorId, deadline } = response.value.data;

        const signatureArrayU8 = hashToU8Array(signature);

        acc.signatures.push(signatureArrayU8);
        acc.validators_pks.push(validatorId);
        acc.deadline = deadline;
      }

      return acc;
    }, {
      signatures: [],
      validators_pks: [],
      deadline: 0,
    });

    if (signatures.length > 0) {
      const response = await contract.current.link_account({
        service_id: {
          service: Service.stackOverflow,
          id: String(userId),
        },
        access_token_hash: hashToU8Array(access_token_hash),
        account_id: accountId,
        deadline: deadline,
        signatures,
        validators_pks
      })

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
