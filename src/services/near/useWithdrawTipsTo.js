import { useCallback } from 'react';
import axios from 'axios';

import { BOT_HOST } from 'constants/hosts';

import { generateLinkParams } from './useLinkAccount/utils';

const useWithdrawTipsTo = ({ userInfo, updateBalance }) => {
  return useCallback(async (address) => {
    if (!userInfo) {
      return;
    }

    const linkParams = await generateLinkParams({
      accessToken: userInfo.accessToken,
      userId: userInfo.userId,
      // TODO: add existence check for address
      accountId: address,
    });

    if (!linkParams) return;

    console.log({ linkParams })

    const res = await axios.post(`${BOT_HOST}/v1/withdraw_to`, {
      ...linkParams,
    });

    console.log('Rewards was sent to: ', address, { res });

    updateBalance();
  }, [userInfo, updateBalance]);
}

export default useWithdrawTipsTo;
