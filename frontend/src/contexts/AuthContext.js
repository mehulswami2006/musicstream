import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const apiBase = process.env.REACT_APP_API || '';
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user when token changes (or on mount)
  useEffect(() => {
    let cancelled = false;
    async function fetchMe() {
      if (!token) {
        setUser(null);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!cancelled) setUser(res.data);
      } catch (err) {
        console.warn('Failed to fetch /api/auth/me', err?.response?.data || err.message);
        // invalid token -> clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMe();
    return () => { cancelled = true; };
  }, [token, apiBase]);

  const login = (newToken, userObj) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    }
    if (userObj) setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
