import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import Header from 'components/Header';
import Socials from 'scenes/Socials';
import Rewards from 'scenes/Rewards';
import Redirect from 'scenes/Redirect';

import styles from './App.module.scss';

function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route
          index
          element={(
            <div className={styles.content}>
              <Socials
                className={styles.scene}
              />

              <Rewards
                className={styles.scene}
              />
            </div>
          )}
        />

        <Route
          path="/redirect"
          element={(
            <div className={styles.content}>
              <Redirect className={styles.scene} />
            </div>
          )}
        />
      </Routes>
    </div>
  )
}

export default App;
