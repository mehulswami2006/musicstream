// frontend/src/pages/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const api = process.env.REACT_APP_API || '';

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await axios.post(`${api}/api/auth/login`, { email, password });
      // response: { token, user }
      login(res.data.token, res.data.user);
      nav('/songs');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || (err?.response?.data?.errors && JSON.stringify(err.response.data.errors)) || 'Login failed';
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input type="email" value={email} required onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label><br />
          <input type="password" value={password} required onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
          <button type="button" onClick={() => nav('/register')}>Register</button>
        </div>
      </form>
    </div>
  );
}
