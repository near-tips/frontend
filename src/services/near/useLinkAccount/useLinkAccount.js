import { useCallback } from 'react';

import { makeSignatures } from './utils';

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId }) => {
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

    console.log(withdrawParams);

    await contract.link_account(withdrawParams);

    await updateBalance();
  }, [userInfo, updateBalance, contract, accountId]);
}

export default useLinkAccount;
