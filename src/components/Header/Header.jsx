import React from 'react';

import Connect from 'components/Connect';

import Logo from './Logo';

import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />

      <a
        href="https://t.co/OmzwviG5S7"
        target="_blank"
        className={styles.extensionLink}
      >
        Install extension for making tips
      </a>

      <Connect className={styles.connect} />
    </div>
  )
};

export default Header;
