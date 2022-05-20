import React from 'react';
import cn from 'classnames';
import { SpinnerInfinity } from 'spinners-react';

import styles from './Loader.module.scss';

const Loader = ({ className }) => {
  return (
    <SpinnerInfinity
      className={cn([className, styles.loader])}
      size={120}
      thickness={100}
      speed={70}
      color="none"
      secondaryColor="rgba(0, 0, 0, 0.44)"
    />
  )
};

export default Loader;
