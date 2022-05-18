import { useCallback } from 'react';

import { generateLinkParams } from './utils';

const useLinkAccount = ({ userInfo, updateBalance, contract, accountId }) => {
  return useCallback(async () => {
    console.log({
      userInfo, contract, accountId,
    })
    if (!userInfo || !contract.current || !accountId) {
      return
    }

    const { accessToken, userId } = userInfo

    const linkParams = await generateLinkParams({
      accountId,
      accessToken,
      userId,
    })

    console.log(linkParams)

    await contract.current.link_account(linkParams)

    await updateBalance()
  }, [userInfo, updateBalance, contract, accountId])
}

export default useLinkAccount
