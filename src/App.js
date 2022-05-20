import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import Header from 'components/Header';
import Socials from 'scenes/Socials';
import Rewards from 'scenes/Rewards';
import Redirect from 'scenes/Redirect';
import NotFound from 'scenes/NotFound';

import styles from './App.module.scss';

function App() {
  return (
    <div>
      <Header />

      <div className={styles.content}>
        <Routes>
          <Route
            index
            element={(
              <>
                <Socials
                  className={styles.scene}
                />

                <Rewards
                  className={styles.scene}
                />
              </>
            )}
          />

          <Route
            path="/redirect"
            element={<Redirect className={styles.scene} />}
          />

          <Route
            path="*"
            element={<NotFound className={styles.scene} />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App;
