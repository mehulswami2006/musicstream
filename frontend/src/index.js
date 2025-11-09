// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueueProvider } from './contexts/QueueContext';
import { AuthProvider } from './contexts/AuthContext'; // ensure this exists
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueueProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueueProvider>
    </AuthProvider>
  </React.StrictMode>
);
