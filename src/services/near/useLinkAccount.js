import { useCallback } from 'react';
import axios from 'axios';
import * as borsh from 'borsh'

import { fromHexToU8Array, hexToU8Array } from 'utils/formatter';
import { Service } from './utils';
import {serialize, deserialize} from 'near-api-js/lib/utils';

const VALIDATORS = [
  // 'https://val1.near-tips.com',
  // 'https://val2.near-tips.com',
  'http://localhost:8082',
];

class SCData {
  constructor({ service_id, account_id, deadline }) {
    this.service_id = service_id
    this.account_id = account_id
    this.deadline = deadline
  }
}

class ServiceId {
  constructor({ service, id }) {
    this.service = service
    this.id = id
  }
}

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId }) => {
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

    console.log({responses})

    const {
      signatures,
      validators_pks,
      deadline,
    } = responses.reduce((acc, response) => {
      if (response.status === 'fulfilled') {
        const { signature, validatorId, deadline } = response.value.data;

        // const signatureArrayU8 = [...Buffer.from(signature, 'hex')]
        // const signatureArrayU8T = fromHexToU8Array(signature);
        const signatureArrayU8T = Array.from({
          ...signature,
          length: Object.keys(signature).length,
        })

        console.log({ signatureArrayU8T })

        acc.signatures.push(signatureArrayU8T);
        acc.validators_pks.push(validatorId);
        acc.deadline = deadline;
      }

      return acc;
    }, {
      signatures: [],
      validators_pks: [],
      deadline: '0',
    })

    console.log({
      signatures,
      validators_pks,
      deadline,
    })


    // ---


    // const value = new SCData({
    //   service_id: new ServiceId({ service: Service.Stackoverflow, id: userId }),
    //   account_id: accountId,
    //   deadline: deadline,
    // })
    //
    // // Schema for serialization
    // const schema = new Map([
    //   [SCData, {
    //     kind: 'struct',
    //     fields: [
    //       ['service_id', ServiceId],
    //       ['account_id', 'string'],
    //       ['deadline', 'u64'],
    //     ]
    //   }],
    //   [ServiceId, {
    //     kind: 'struct',
    //     fields: [
    //       ['service', 'u8'], ['id', 'string']
    //     ]
    //   }]
    // ]);
    //
    // console.log({ value, schema })
    // const buffer = borsh.serialize(schema, value);
    //
    // const newValue = borsh.deserialize(schema, SCData, buffer);
    //
    // console.log({ newValue })


    // ---

    // return;
    if (signatures.length > 0) {
      console.log({
        service_id: new ServiceId({
          service: Service.Stackoverflow,
          id: String(userId),
        }),
        account_id: accountId,
        deadline: deadline,
        signatures,
        validators_pks
      })
      const response = await contract.link_account({
        service_id: new ServiceId({
          service: Service.Stackoverflow,
          id: String(userId),
        }),
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
