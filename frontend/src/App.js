// frontend/src/App.js
import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import Splash from './pages/Splash';
import Choice from './pages/Choice';
import Login from './pages/Login';
import Register from './pages/Register';
import SongsPage from './pages/SongsPage';
import PublicPlaylists from './pages/PublicPlaylists';
import MyPlaylists from './pages/MyPlaylists';
import QueuePage from './pages/QueuePage';
import PremiumPage from './pages/PremiumPage';

// Components
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';

// Contexts
import { AuthContext } from './contexts/AuthContext';

// Styles & assets
import './App.css';
import logo from './assets/MusicStreamLogo.png';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { token } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000); // show splash 3s
    return () => clearTimeout(t);
  }, []);

  // Routes where the player bar should be hidden
  const hidePlayerOn = ['/', '/login', '/register'];
  const shouldShowPlayer = !hidePlayerOn.includes(location.pathname);

  // Inline CSS variable to inject background logo (used by .app-bg::before)
  const bgStyle = { '--bg-logo': `url(${logo})` };

  if (showSplash) return <Splash />;

  return (
    <div className="app-bg" style={bgStyle}>
      <Navbar />

      <main style={{ paddingTop: '1rem' }}>
        <Routes>
          <Route path="/" element={<Choice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/playlists/public" element={<PublicPlaylists />} />
          <Route
            path="/playlists/mine"
            element={token ? <MyPlaylists /> : <Navigate to="/login" />}
          />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Player bar is visible only after login / non-auth routes */}
      {shouldShowPlayer && <PlayerBar />}
    </div>
  );
}
