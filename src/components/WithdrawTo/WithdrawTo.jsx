import React from 'react'

import styles from './WithdrawTo.module.scss'

const WithdrawTo = () => {
  return (
    <div className={styles.withdrawTo}>
      <input className={styles.addressInput} type="text" />
      <button className={styles.button}>Withdraw</button>
    </div>
  )
}

export default WithdrawTo