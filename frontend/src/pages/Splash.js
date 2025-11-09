// frontend/src/pages/Splash.js
import React from 'react';
import './Splash.css';
import logo from '../assets/MusicStreamLogo.png';

export default function Splash() {
  return (
    <div className="splash-root" role="status" aria-live="polite">
      <div className="splash-card">
        <img src={logo} alt="MusicStream" className="splash-logo" draggable="false" />
        <h1 className="splash-title">MusicStream</h1>

        <div className="loading-dots" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>

        <div className="loading-sub muted">Loading…</div>
      </div>
    </div>
  );
}
