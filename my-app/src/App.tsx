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
  return (
    <UIProvider>
      <div className="page-background">
        <div className="container">
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<UserPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/about' element={<About />} />
              <Route path='/test' element={<Test />} />
              <Route path='/client0' element={<Client />} />
              <Route path='/viewer' element={<Viewer />} />

            </Routes>
          </Router>
        </div>
      </div>
    </UIProvider>
  );
}

export default App;
