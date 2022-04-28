import React from 'react';

import useNear from 'services/near'

import styles from './NearWalletLogin.module.scss';

const NearWalletLogin = () => {
  const { signIn } = useNear()

  return (
    <button
      className={styles.nearButton}
      onClick={signIn}
    >
      Connect
    </button>
  )
}

export default NearWalletLogin;
