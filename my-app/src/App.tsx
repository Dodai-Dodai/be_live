import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UIProvider } from '@yamada-ui/react';
import './App.css'; // CSSファイルをインポート

// ページコンポーネントをインポート
import Home from './pages/Home';
import About from './pages/About';
import Test from './pages/Test';
import Client from './pages/cast';

const App = () => {
  return (
    <UIProvider>
      <div className="page-background">
        <div className="container">
          <Router>
            <Routes>

              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/test' element={<Test />} />
              <Route path='/client0' element={<Client />} />

            </Routes>
          </Router>
        </div>
      </div>
    </UIProvider>
  );
}

export default App;
