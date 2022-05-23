import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { StackOverflowProvider } from 'services/stackoverflow';
import { NearProvider } from 'services/near';
import ErrorBoundary from 'components/ErrorBoundary';

import App from './App';

import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <StackOverflowProvider>
          <NearProvider>
            <App />
          </NearProvider>
        </StackOverflowProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
