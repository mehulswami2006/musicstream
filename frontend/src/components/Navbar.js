// frontend/src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">🎵 MusicStream</div>
      </div>

      <div className="navbar-right">
        <Link to="/songs">Songs</Link>
        <Link to="/playlists/public">Public Playlists</Link>
        <Link to="/playlists/mine">My Playlists</Link>
        <Link to="/queue">Queue</Link>
        <Link to="/premium">Premium</Link>
      </div>
    </nav>
  );
}
