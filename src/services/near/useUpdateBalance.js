import { useCallback } from 'react';

import { yoctoNEARToNear } from 'utils/formatter';

import { callViewMethodViaProvider, Service } from './utils';

const useUpdateBalance = ({ setUserRewards }) => {
  return useCallback((userId) => {
    callViewMethodViaProvider({
      methodName: 'get_service_id_tips',
      args: {
        service_id: {
          service: Service.stackOverflow,
          id: String(userId)
        }
      }
    }).then(res => {
      setUserRewards(current => current + Number(yoctoNEARToNear(res)))
    })
  }, [setUserRewards])
}

export default useUpdateBalance
