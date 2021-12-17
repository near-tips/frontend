import React, { useCallback, useEffect, useState } from 'react';

import Loader from 'components/Loader';
import { USER_INFO_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';

import { loginWithStackOverflow, fetchUserInfo, getAccessToken } from './utils';

import styles from './StackOverflowLogin.module.scss';

const StackOverflowLogin = ({ setUserInfo }) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = useCallback((auth) => {
    setIsLoading(true);

    return fetchUserInfo(auth.accessToken).then(response => {
      console.log({ response })
      const userInfo = {
        ...auth,
        userId: response.data.items[0].user_id,
      };

      setUserInfo(userInfo)

      localStorage.setItem(USER_INFO_LOCAL_STORAGE_KEY, JSON.stringify(userInfo));
    }).catch(err => {
      console.error(err);

      localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
      setUserInfo(null);
    }).finally(() => {
      setIsLoading(false);
    })
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem(USER_INFO_LOCAL_STORAGE_KEY));

    if (userInfo) {
      console.log({ userInfo })

      if ((userInfo.expiration * 1000) + userInfo.timeOfRequest < new Date().getTime()) {
        console.log('remove deprecated access token');

        localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
      } else {
        console.log('set user from local storage');

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

  const handleClick = useCallback(() => {
    loginWithStackOverflow(window.location.toString());
  }, [])

  return isLoading ? <Loader className={styles.loader} /> : (
    <button
      className={styles.stackButton}
      onClick={handleClick}
    >
      Sign in with StackOverflow
    </button>
  )
}

export default StackOverflowLogin;
