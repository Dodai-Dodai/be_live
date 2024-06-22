import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UIProvider } from '@yamada-ui/react';
import { BrowserRouter as Router } from 'react-router-dom'; // BrowserRouterをインポート

const container = document.getElementById('root') || document.createElement('div');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);