import React from 'react';

import useStackOverflow, { loginWithStackOverflow } from 'services/stackoverflow';

import styles from './StackOverflowLogin.module.scss';

const StackOverflowLogin = () => {
  const { isLoggedIn } = useStackOverflow();

  return (
    <button
      className={styles.stackButton}
      onClick={loginWithStackOverflow}
      disabled={isLoggedIn}
    >
      StackOverflow {isLoggedIn ? ':: logged in' : ''}
    </button>
  )
}

export default StackOverflowLogin;
