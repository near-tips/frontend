import React from 'react';

import Logo from './Logo';

import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
    </div>
  )
};

export default Header;
