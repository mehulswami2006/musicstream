// frontend/src/pages/Choice.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Choice.css';
import logo from '../assets/MusicStreamLogo.png';

export default function Choice() {
  const nav = useNavigate();

  return (
    <div className="choice-root">
      <div className="choice-left card">
        <div className="choice-brand">
          <img src={logo} alt="MusicStream" className="choice-logo" />
          <div className="choice-title">MusicStream</div>
        </div>

        <div className="choice-intro">
          <h2>Welcome to MusicStream</h2>
          <p className="muted">
            Stream songs, create playlists and discover public playlists — either sign in or try the app as a guest.
          </p>
        </div>

        <div className="choice-actions">
          <div className="choice-action">
            <h3>Login / Register</h3>
            <p className="muted">Sign in to save playlists, make private playlists, and purchase premium.</p>
            <div className="action-buttons">
              <button onClick={() => nav('/login')} aria-label="Login">Login</button>
              <button className="secondary" onClick={() => nav('/register')} aria-label="Register">Register</button>
            </div>
          </div>

          <div className="divider" />

          <div className="choice-action">
            <h3>Use without Login</h3>
            <p className="muted">Browse songs, play music and view public playlists. To purchase premium you'll need to sign in.</p>
            <div className="action-buttons">
              <button onClick={() => nav('/songs?guest=true')} aria-label="Use without login">Continue as Guest</button>
            </div>
          </div>
        </div>

        <footer className="choice-footer muted">
          By continuing you agree to our Terms & Privacy.
        </footer>
      </div>

      <aside className="choice-right">
        <div className="visual-wrap">
          <div className="visual-card">
            <img src={logo} alt="MusicStream decorative" className="visual-logo" />
            <h3 className="visual-heading">Your music, everywhere</h3>
            <p className="muted">Create playlists, listen offline with Premium, and share your favorite tracks with the world.</p>

            <div className="feature-list">
              <div className="feature"><strong>✔</strong> Add songs from the web</div>
              <div className="feature"><strong>✔</strong> Public & private playlists</div>
              <div className="feature"><strong>✔</strong> Queue & auto-play</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
