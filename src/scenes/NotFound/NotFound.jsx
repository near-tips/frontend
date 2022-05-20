import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import failureIcon from 'images/failure.png';

import styles from './NotFound.module.scss';

const NotFound = ({ className }) => {
  return (
    <div className={cn([styles.notFound, className])}>
      <div className={styles.title}>
        Not Found
      </div>

      <img
        src={failureIcon}
        alt="Not Found img"
        className={styles.icon}
      />

      <Link
        to="/"
        className={styles.goHomeBtn}
      >
        Go Home
      </Link>
    </div>
  )
};

export default NotFound;
