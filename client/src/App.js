import background from './background.jpg';
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MapView from './components/MapView';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <div className="map-root">
        <button
          className="logout-btn"
          onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
          }}
        >
          Çıkış Yap
        </button>
        <MapView />
      </div>
    );
  }

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        background: `url(${background}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="auth-container">
        <div className="tab-buttons">
          <button className={`tab-btn${showLogin ? ' active' : ''}`} onClick={() => setShowLogin(true)}>Giriş Yap</button>
          <button className={`tab-btn${!showLogin ? ' active' : ''}`} onClick={() => setShowLogin(false)}>Kayıt Ol</button>
        </div>
        {showLogin ? <Login onLogin={() => setIsLoggedIn(true)} /> : <Register />}
      </div>
    </div>
  );
}

export default App;