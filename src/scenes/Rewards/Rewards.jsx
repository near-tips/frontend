import React from 'react';
import cn from 'classnames';

import styles from './Rewards.module.scss';

const Rewards = ({ className }) => {
  return (
    <div className={cn([className, styles.rewards])}>
      Rewards and options to chose how to claim
    </div>
  )
}

export default Rewards;
