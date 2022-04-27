import React from "react";

import Header from 'components/Header';
import Socials from 'scenes/Socials';
import Rewards from 'scenes/Rewards';

import styles from './App.module.scss';

function App() {
  return (
    <div>
      <Header />

      <div className={styles.content}>
        <Socials />

        <Rewards />
      </div>
    </div>
  )
}

export default App;
