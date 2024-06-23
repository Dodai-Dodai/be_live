import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UIProvider } from '@yamada-ui/react';

import Home from './pages/Home';
import UserPage from './pages/userPage';
import About from './pages/About';
import Test from './pages/Test';
import Client from './pages/cast';
import Viewer from './pages/viewer';
import Login from './pages/login';

const App = () => {
  const APP_NAME: String = "be_live";
  return (
    <Router>
      <Routes>
        <Route path={APP_NAME + '/'} element={<Home />} />
        <Route path={APP_NAME + '/home'} element={<UserPage />} />
        <Route path={APP_NAME + '/login'} element={<Login />} />
        <Route path={APP_NAME + '/about'} element={<About />} />
        <Route path={APP_NAME + '/test'} element={<Test />} />
        <Route path={APP_NAME + '/client0'} element={<Client />} />
        <Route path={APP_NAME + '/viewer'} element={<Viewer />} />

      </Routes>
    </Router>
  );
}

export default App;
