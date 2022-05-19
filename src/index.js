import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { StackOverflowProvider } from 'services/stackoverflow';
import { NearProvider } from 'services/near';

import App from './App';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StackOverflowProvider>
        <NearProvider>
          <App />
        </NearProvider>
      </StackOverflowProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
