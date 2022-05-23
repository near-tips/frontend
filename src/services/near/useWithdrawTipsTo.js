import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { BOT_HOST } from 'constants/hosts';
import logger from 'utils/logger';

import { makeSignatures } from './useLinkAccount/utils';

const useWithdrawTipsTo = ({ userInfo, updateBalance, userRewards }) => {
  return useCallback(async (address) => {
    if (!userInfo) {
      return;
    }

    const withdrawParams = await makeSignatures({
      accessToken: userInfo.accessToken,
      userId: userInfo.userId,
      // TODO: add existence check for address
      accountId: address,
    });

    if (!withdrawParams) {
      logger.error('missing withdrawParams');

      return;
    }

    logger.log(withdrawParams)

    const res = await toast.promise(
      axios.post(`${BOT_HOST}/v1/withdraw_to`, withdrawParams),
      {
        pending: `Withdraw to ${address} pending...`,
        success: `Withdraw ${userRewards} Ⓝ to ${address} confirmed.`,
        error: {
          render({ error }) {
            logger.error('withdraw_to problem', error);

            return 'Something went wrong. Try again later.'
          }
        },
      }
    );

    logger.log('Rewards was sent to: ', address, { res });

    updateBalance();
  }, [userInfo, updateBalance, userRewards]);
}

export default useWithdrawTipsTo;
