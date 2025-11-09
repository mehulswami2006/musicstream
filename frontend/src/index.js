// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueueProvider } from './contexts/QueueContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

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
