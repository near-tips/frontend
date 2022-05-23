import { useCallback, useState, useEffect } from 'react';

import { yoctoNEARToNear } from 'utils/formatter';
import useStackOverflow from 'services/stackoverflow';
import logger from 'utils/logger';

import { callViewMethodViaProvider, Service } from './utils';

const useBalance = ({ contract, wallet, linkedAccounts }) => {
  const [userRewards, setUserRewards] = useState(0);

  const { userInfo } = useStackOverflow();

  // TODO: change for more services depence on logged in services
  const updateBalance = useCallback(async () => {
    logger.log('updateBalance', {
      contract, userInfo, linkedAccounts,
    })
    if (contract && linkedAccounts.length > 0) {
      const res = await contract.get_account_id_tips({ account_id: wallet.account().accountId });

      setUserRewards(Number(yoctoNEARToNear(res)));
    } else {
      const services = [userInfo && {
        id: userInfo.userId,
        name: Service.Stackoverflow,
      }].filter(Boolean);

      let rewards = 0;

      for (let i = 0; i < services.length; i++) {
        const res = await callViewMethodViaProvider({
          methodName: 'get_service_id_tips',
          args: {
            service_id: {
              service: services[i].name,
              id: String(services[i].id)
            }
          }
        });

        rewards += Number(yoctoNEARToNear(res));
      }

      setUserRewards(rewards);
    }
  }, [setUserRewards, userInfo, wallet, contract, linkedAccounts]);

  useEffect(() => {
    updateBalance();
    // add linked accs to dep?
  }, [userInfo, linkedAccounts]);

  return {
    updateBalance,
    userRewards,
  }
}

export default useBalance;
