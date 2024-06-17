// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { UIProvider } from '@yamada-ui/react';
import App from './App';

ReactDOM.render(
  <UIProvider>
    <App />
  </UIProvider>,
  document.getElementById('root')
);
