import { createRoot } from 'react-dom/client';
import App from './App';
import { UIProvider } from '@yamada-ui/react';
import { BrowserRouter as Router } from 'react-router-dom'; // BrowserRouterをインポート
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <UIProvider>
      <App />
    </UIProvider>
  );
} else {
  console.error('Root container not found');
}

serviceWorkerRegistration.register();