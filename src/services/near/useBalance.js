import { useCallback, useState } from 'react';

import { yoctoNEARToNear } from 'utils/formatter';
import useStackOverflow from 'services/stackoverflow';

import { callViewMethodViaProvider, Service } from './utils';

const useBalance = ({ contract, wallet }) => {
  const [userRewards, setUserRewards] = useState(0);

  const { userInfo } = useStackOverflow()

  const updateBalance = useCallback(async () => {
    console.log('updateBalance', {
      contract, userInfo,
    })
    if (contract) {
      const res = await contract.current.get_account_id_tips({account_id: wallet.current.account().accountId});

      setUserRewards(Number(yoctoNEARToNear(res)));
    } else {
      // TODO: change for more services depence on logged in services
      const services = [{
        id: userInfo?.userId,
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
  }, [setUserRewards, userInfo, wallet.current]);

  return {
    updateBalance,
    userRewards,
  }
}

export default useBalance;
