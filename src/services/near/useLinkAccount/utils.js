import axios from 'axios';

import { VALIDATORS } from 'constants/hosts';

import { Service } from '../utils';

class ServiceId {
  constructor({ service, id }) {
    this.service = service
    this.id = id
  }
}

export const generateLinkParams = async ({ accessToken, userId, accountId }) => {
  console.log({
    accessToken,
    userId: String(userId),
    accountId,
  })
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
  });

  if (signatures.length > 0) {
    return {
      service_id: new ServiceId({
        service: Service.Stackoverflow,
        id: String(userId),
      }),
      account_id: accountId,
      deadline: deadline,
      signatures,
      validators_pks
    };
  }

  return null;
}