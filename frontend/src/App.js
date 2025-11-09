// frontend/src/App.js
import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Splash from './pages/Splash';
import Choice from './pages/Choice';
import Login from './pages/Login';
import Register from './pages/Register';
import SongsPage from './pages/SongsPage';
import PublicPlaylists from './pages/PublicPlaylists';
import MyPlaylists from './pages/MyPlaylists';
import QueuePage from './pages/QueuePage';
import PremiumPage from './pages/PremiumPage';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import { AuthContext } from './contexts/AuthContext';
import './App.css'; // optional - if you have global App styles

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { token } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1500); // 1.5s
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <Splash />;

  // hide PlayerBar on these routes (adjust as needed)
  const hidePlayerOn = ['/', '/login', '/register'];
  const shouldShowPlayer = !hidePlayerOn.includes(location.pathname);

  // wrap content in app-bg so blurred logo sits behind everything
  return (
    <div className="app-bg">
      <Navbar />
      <main style={{ paddingTop: 12 }}>
        <Routes>
          <Route path="/" element={<Choice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/playlists/public" element={<PublicPlaylists />} />
          <Route path="/playlists/mine" element={ token ? <MyPlaylists /> : <Navigate to="/login" /> } />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {shouldShowPlayer && <PlayerBar />}
    </div>
  );
}
