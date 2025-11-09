// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueueProvider } from './contexts/QueueContext';
import { AuthProvider } from './contexts/AuthContext'; // if you have this file
import PlayerBar from './components/PlayerBar';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueueProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <PlayerBar />
      </QueueProvider>
    </AuthProvider>
  </React.StrictMode>
);
