import { useCallback } from 'react';

import { generateLinkParams } from './utils';

const useLinkAccount = ({ userInfo, setUserRewards, contract, accountId }) => {
  return useCallback(async () => {
    console.log({
      userInfo, contract, accountId,
    })
    if (!userInfo || !contract || !accountId) {
      return
    }

    const { accessToken, userId } = userInfo

    const linkParams = await generateLinkParams({
      accountId,
      accessToken,
      userId,
    })

    console.log(linkParams)

    await contract.link_account(linkParams)

    // TODO: use updateBalance after to show true value
    setUserRewards(0)
  }, [userInfo, setUserRewards, contract, accountId])
}

export default useLinkAccount
