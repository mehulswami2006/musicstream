// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar(){
  const { user, logout, token } = useContext(AuthContext);
  const nav = useNavigate();

  const handlePremiumClick = () => {
    if (!token) {
      // show login prompt
      nav('/login');
    } else {
      nav('/premium');
    }
  };

  return (
    <nav style={{display:'flex',gap:10,padding:10,alignItems:'center',borderBottom:'1px solid #ddd'}}>
      <Link to="/songs">Songs</Link>
      <Link to="/playlists/public">Public Playlists</Link>
      { token && <Link to="/playlists/mine">My Playlists</Link> }
      <Link to="/queue">Queue</Link>
      <button onClick={handlePremiumClick}>Premium</button>

      <div style={{marginLeft:'auto'}}>
        { user ? (
          <>
            <span>{user.name || user.email}</span>
            <button onClick={()=>{logout(); nav('/');}}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        ) }
      </div>
    </nav>
  );
}
