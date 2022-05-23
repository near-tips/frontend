import React, { useState, useMemo, useEffect, useCallback } from 'react';

import { USER_INFO_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';
import logger from 'utils/logger';

import StackOverflowContext from './StackOverflowContext'
import { fetchUserInfo, getAccessToken } from './utils';

const StackOverflowProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null)

  const fetchUser = useCallback((auth) => {
    return fetchUserInfo(auth.accessToken).then(response => {
      logger.log({ response })
      const userInfo = {
        ...auth,
        userId: response.data.items[0].user_id,
      };

      setUserInfo(userInfo)

      localStorage.setItem(USER_INFO_LOCAL_STORAGE_KEY, JSON.stringify(userInfo));
    }).catch(err => {
      logger.error(err);

      localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
      setUserInfo(null);
    })
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem(USER_INFO_LOCAL_STORAGE_KEY));

    if (userInfo) {
      if ((userInfo.expiration * 1000) + userInfo.timeOfRequest < new Date().getTime()) {
        logger.log('remove deprecated access token');

        localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
      } else {
        logger.log('set user from local storage', userInfo);

        setUserInfo(userInfo);
      }
    }

    if (window.location.hash) {
      const auth = getAccessToken(window.location.hash);

      fetchUser(auth).then(() => {
        window.location.replace(window.location.origin);
      })
    }
  }, []);

  const value = useMemo(() => {
    logger.log({
      userInfo,
      isLoggedIn: Boolean(userInfo),
    })
    return {
      userInfo,
      isLoggedIn: Boolean(userInfo),
    }
  }, [userInfo])

  return (
    <StackOverflowContext.Provider value={value}>
      {children}
    </StackOverflowContext.Provider>
  )
}

export default StackOverflowProvider