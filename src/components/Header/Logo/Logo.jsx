import React from 'react';
import cn from 'classnames';

import teaJsLogo from 'images/logo.png';

import styles from './Logo.module.scss';

const Logo = ({ className }) => {
  return (
    <img
      className={cn(styles.logo, className)}
      src={teaJsLogo}
      alt="TeaJS"
    />
  )
}

export default Logo;