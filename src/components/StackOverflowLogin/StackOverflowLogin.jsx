import React, { useMemo } from 'react';

import useStackOverflow, { loginWithStackOverflow } from 'services/stackoverflow';
import useNear, { Service } from 'services/near';

import styles from './StackOverflowLogin.module.scss';

const StackOverflowLogin = () => {
  const { isLoggedIn } = useStackOverflow();
  const { linkedAccounts } = useNear();

  const isLinked = useMemo(() => {
    return Boolean(linkedAccounts.find(account => account.service === Service.Stackoverflow))
  }, [linkedAccounts]);

  return (
    <button
      className={styles.stackButton}
      onClick={loginWithStackOverflow}
      disabled={isLoggedIn || isLinked}
    >
      StackOverflow {isLoggedIn ? ':: logged in' : isLinked ? ':: linked' : ''}
    </button>
  )
}

export default StackOverflowLogin;
