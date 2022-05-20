import { useCallback } from 'react';
import axios from 'axios';

import { BOT_HOST } from 'constants/hosts';

import { makeSignatures } from './useLinkAccount/utils';

const useWithdrawTipsTo = ({ userInfo, updateBalance }) => {
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

    if (!withdrawParams) return;

    console.log({ withdrawParams })

    const res = await axios.post(`${BOT_HOST}/v1/withdraw_to`, {
      ...withdrawParams,
    });

    console.log('Rewards was sent to: ', address, { res });

    updateBalance();
  }, [userInfo, updateBalance]);
}

export default useWithdrawTipsTo;
