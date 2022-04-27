import React from 'react';
import ReactDOM from 'react-dom';

import AppDataProvider from 'shared/AppDataContext/AppDataProvider';

import App from './App';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <AppDataProvider>
      <App />
    </AppDataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
