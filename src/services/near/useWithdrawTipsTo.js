import { useCallback } from 'react';
import axios from 'axios';

import { BOT_HOST } from 'constants/hosts';

import { generateLinkParams } from './useLinkAccount/utils';

// TODO: move to hooks and reorganize near context
const useWithdrawTipsTo = ({ userInfo, contract, setUserRewards }) => {
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

    console.log({ linkParams })

    const res = await axios.post(`${BOT_HOST}/v1/withdraw_to`, {
      ...linkParams,
    });

    console.log('Rewards was sent to: ', address, { res });

    // TODO: use updateBalance after to show true value
    setUserRewards(0);
  }, [contract, userInfo]);
}

export default useWithdrawTipsTo;
