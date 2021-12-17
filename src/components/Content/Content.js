import React from 'react';

import MainForm from './MainForm';

import styles from './Content.module.scss';

const Content = () => {
  return (
    <div className={styles.content}>
      <MainForm />
    </div>
  )
}

export default Content;