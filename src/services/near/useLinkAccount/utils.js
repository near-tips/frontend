import axios from 'axios';
import { toast } from 'react-toastify';

import { VALIDATORS } from 'constants/hosts';
import logger from 'utils/logger';

import { Service } from '../utils';

class ServiceId {
  constructor({ service, id }) {
    this.service = service
    this.id = id
  }
}

const getSignatures = async ({ accessToken, userId, accountId }) => {
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

  if (signatures.length === 0) {
    throw 'Not enough signatures';
  }

  return {
    signatures,
    validators_pks,
    deadline,
  };
}

export const makeSignatures = async ({ accessToken, userId, accountId }) => {
  logger.log({
    accessToken,
    userId: String(userId),
    accountId,
  })

  const {
    signatures,
    validators_pks,
    deadline,
  } = await toast.promise(
    getSignatures({ accessToken, userId, accountId }),
    {
      pending: 'Validators are signing transaction...',
      success: {
        render({ data: { signatures } }) {
          return `Signed by ${signatures.length} validators`;
        }
      },
      error: {
        render({ error }) {
          logger.error('Signing problem: ', error);

          return 'Something went wrong. Try again later.';
        }
      },
    }
  );

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