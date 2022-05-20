import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { providers } from 'near-api-js';

import successIcon from './assets/success.png';
import failureIcon from './assets/failure.png';
import styles from './Redirect.module.scss';

const provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_NEAR_ARCHIVAL_NODE_URL
);

// search = { redirectUrl, successMessage, failureMessage, transactionHashes, accountId }
const Redirect = ({ className }) => {
  const [success, setSuccess] = useState(null);
  const { search } = useLocation();
  const { redirectUrl, successMessage, failureMessage, transactionHashes, accountId } = queryString.parse(search);

  useEffect(() => {
    const checkTx = async (transactionHashes, accountId) => {
      if (!transactionHashes) {
        return false;
      }

      const res = await provider.txStatus(transactionHashes, accountId);

      setSuccess(true);
    }

    checkTx(transactionHashes, accountId).catch(console.error);
  }, [transactionHashes, accountId]);

  const handleClick = useCallback(() => {
    window.open(redirectUrl, '_self');
  }, [redirectUrl]);

  const isSuccess = success === 'true';

  return success === null ? null : (
    <div className={cn([className, styles.redirect])}>
      {
        isSuccess ?
          <img className={styles.icon} src={successIcon} alt="Success" /> :
          <img className={styles.icon} src={failureIcon} alt="Error" />
      }

      <div className={styles.label}>
        {isSuccess ? successMessage : failureMessage}
      </div>

      <button
        className={styles.goBack}
        onClick={handleClick}
      >
        Go Back
      </button>
    </div>
  )
};

export default Redirect;
