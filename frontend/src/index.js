// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // you already have one from earlier
import { QueueProvider } from './contexts/QueueContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <QueueProvider>
        <App />
      </QueueProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
