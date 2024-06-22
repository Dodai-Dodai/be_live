import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { UIProvider } from '@yamada-ui/react';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouterをインポート

ReactDOM.render(
  <React.StrictMode>
	<UIProvider>
	  <BrowserRouter>
		<App />
	  </BrowserRouter>
	</UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

