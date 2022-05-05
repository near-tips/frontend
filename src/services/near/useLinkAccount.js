import { useCallback } from 'react';
import axios from 'axios';

import { Service } from './utils';

const VALIDATORS = [
  'https://val1.near-tips.com',
  'https://val2.near-tips.com',
  // 'http://localhost:8082',
];

class ServiceId {
  constructor({ service, id }) {
    this.service = service
    this.id = id
  }
}

const useLinkAccount = ({ userInfo, setUserRewards, contract, accountId }) => {
  return useCallback(async () => {
    console.log({
      userInfo, contract, accountId,
    })
    if (!userInfo || !contract || !accountId) {
      return
    }

    const { accessToken, userId } = userInfo

    // sign transactions through validators
    const responses = await Promise.allSettled(VALIDATORS.map(validator => {
      return axios.post(`${validator}/v1/trans/sign`, {
        accessToken,
        userId: String(userId),
        accountId,
      });
    }));

    const {
      signatures,
      validators_pks,
      deadline,
    } = responses.reduce((acc, response) => {
      if (response.status === 'fulfilled') {
        const { signature, validatorId, deadline } = response.value.data;

        const signatureArrayU8 = Array.from({
          ...signature,
          length: Object.keys(signature).length,
        })

        acc.signatures.push(signatureArrayU8);
        acc.validators_pks.push(validatorId);
        acc.deadline = deadline;
      }

      return acc;
    }, {
      signatures: [],
      validators_pks: [],
      deadline: '0',
    })

    if (signatures.length > 0) {
      const linkParams = {
        service_id: new ServiceId({
          service: Service.Stackoverflow,
          id: String(userId),
        }),
        account_id: accountId,
        deadline: deadline,
        signatures,
        validators_pks
      }

      console.log(linkParams)

      await contract.link_account(linkParams)

      setUserRewards(0)
    }
  }, [userInfo, setUserRewards, contract, accountId])
}

export default useLinkAccount
