import React from 'react';

import Connect from 'components/Connect';

import Logo from './Logo';

import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />

      <Connect />
    </div>
  )
};

export default Header;
