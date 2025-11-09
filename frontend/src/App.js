// src/App.js
import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { AuthContext } from './contexts/AuthContext';

export default function App(){
  const [showSplash, setShowSplash] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const t = setTimeout(()=> setShowSplash(false), 1500); // 1.5s splash
    return ()=> clearTimeout(t);
  }, []);

  if (showSplash) return <Splash />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Choice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/playlists/public" element={<PublicPlaylists />} />
        <Route path="/playlists/mine" element={ token ? <MyPlaylists /> : <Navigate to="/login" /> } />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </>
  );
}
