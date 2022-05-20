import React, { useEffect, useState } from 'react';
import { SpinnerInfinity } from 'spinners-react';

import styles from './ScreenLoader.module.scss';

const ScreenLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  }, []);

  return isVisible && (
    <div className={styles.screenLoader}>
      <SpinnerInfinity
        className={styles.loader}
        size={250}
        thickness={100}
        speed={100}
        color="none"
        secondaryColor="rgba(0, 0, 0, 0.44)"
      />
    </div>
  )
};

export default ScreenLoader;
