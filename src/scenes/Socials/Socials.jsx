import React from 'react';
import cn from 'classnames';

import StackOverflowLogin from 'components/StackOverflowLogin';
import TwitterLogin from 'components/TwitterLogin';

import styles from './Socials.module.scss';

const Socials = ({ className }) => {
  return (
    <div className={cn([className, styles.socials])}>
      <div className={styles.label}>
        Login with social networks to claim your tips from there
      </div>

      <div className={styles.logins}>
        <StackOverflowLogin />
        <TwitterLogin />
      </div>
    </div>
  )
}

export default Socials;
