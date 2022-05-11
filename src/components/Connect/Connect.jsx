import React from 'react';

import useNear from 'services/near';

import styles from './Connect.module.scss';

const Connect = ({ className }) => {
  const { isLoggedIn, accountId, signIn, signOut } = useNear();

  return (
    <div className={className}>
      {isLoggedIn ? (
        <button
          className={styles.accountId}
          onClick={signOut}
        >
          {accountId}
        </button>
      ) : (
        <button
          className={styles.connect}
          onClick={signIn}
        >
          Connect
        </button>
      )}
    </div>
  )
};

export default Connect;
