import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { makeSignatures } from './utils';

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId, userRewards }) => {
  return useCallback(async () => {
    console.log({
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

    if (!withdrawParams) return;

    console.log(withdrawParams);

    await toast.promise(
      contract.link_account(withdrawParams),
      {
        pending: `Link & withdraw pending...`,
        success: `Linked and ${userRewards} Ⓝ sent to your wallet.`,
        error: 'Something went wrong',
      }
    );

    await updateBalance();
  }, [userInfo, updateBalance, contract, accountId, userRewards]);
}

export default useLinkAccount;
