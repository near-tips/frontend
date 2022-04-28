import { useCallback } from 'react';
import sha512 from 'crypto-js/sha512';
import axios from 'axios';

import { hashToU8Array } from 'utils/formatter';
import {Service} from './utils';

const VALIDATORS = [
  'https://val1.near-tips.com',
  'https://val2.near-tips.com',
];

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId }) => {
  return useCallback(async () => {
    console.log({
      userInfo, contract, accountId,
    })
    if (!userInfo || !contract || !accountId) {
      return
    }

    const { accessToken, userId } = userInfo

    const access_token_hash = sha512(accessToken);

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
    })

    if (signatures.length > 0) {
      const response = await contract.link_account({
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
      updateBalance(userId);
    }
  }, [userInfo, updateBalance, contract, accountId])
}

export default useLinkAccount
