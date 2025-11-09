// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // redirect to homepage after logout
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE - LOGO */}
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <img
            src="/MusicStreamLogo.png"
            alt="MusicStream"
            className="brand-logo"
            draggable="false"
          />
          <span className="brand-text">MusicStream</span>
        </Link>
      </div>

      {/* RIGHT SIDE - NAV LINKS */}
      <div className="navbar-right">
        <Link to="/songs">Songs</Link>
        <Link to="/playlists/public">Public Playlists</Link>

        {/* show My Playlists only if logged in */}
        {token && <Link to="/playlists/mine">My Playlists</Link>}

        <Link to="/queue">Queue</Link>
        <Link to="/premium">Premium</Link>

        {/* show Logout or Login/Register */}
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
