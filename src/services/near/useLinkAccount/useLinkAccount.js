import { useCallback } from 'react';
import { toast } from 'react-toastify';

import logger from 'utils/logger';

import { makeSignatures } from './utils';

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId, userRewards }) => {
  return useCallback(async () => {
    logger.log({
      userInfo, contract, accountId,
    });
    if (!userInfo || !contract || !accountId) {
      return;
    }

    const { accessToken, userId } = userInfo;

    const withdrawParams = await makeSignatures({
      accountId,
      accessToken,
      userId,
    });

    if (!withdrawParams) {
      logger.error('no withdraw params: problem with signatures');

      return;
    }

    logger.log(withdrawParams);

    await toast.promise(
      contract.link_account(withdrawParams),
      {
        pending: `Link & withdraw pending...`,
        success: `Linked and ${userRewards} Ⓝ sent to your wallet.`,
        error: {
          render({ error }) {
            logger.error('Link & withdraw problem', error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );

    await updateBalance();
  }, [userInfo, updateBalance, contract, accountId, userRewards]);
}

export default useLinkAccount;
