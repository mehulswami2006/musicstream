// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/MusicStreamLogo.png';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
    // if your auth context only clears token, ensure it does so
    navigate('/'); // redirect to home
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <img src={logo} alt="MusicStream" className="brand-logo" draggable="false" />
          <span className="brand-text">MusicStream</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/songs">Songs</Link>
        <Link to="/playlists/public">Public Playlists</Link>
        {token && <Link to="/playlists/mine">My Playlists</Link>}
        <Link to="/queue">Queue</Link>
        <Link to="/premium">Premium</Link>

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
