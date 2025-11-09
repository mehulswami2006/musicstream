// src/pages/PremiumPage.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function PremiumPage(){
  const { token, user, login } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const purchase = async () => {
    if (!token) return alert('Please login to purchase premium');
    setLoading(true);
    try {
      const res = await axios.post(process.env.REACT_APP_API + '/api/payment/purchase', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // refresh user
      const me = await axios.get(process.env.REACT_APP_API + '/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // update local user object inside your AuthContext - this code depends on your AuthContext implementation
      login(token, me.data);
      alert('Premium activated!');
    } catch (err) {
      console.error(err);
      alert('Payment failed (mock). In prod integrate with payment gateway.');
    } finally { setLoading(false); setOpen(false); }
  };

  return (
    <Modal isOpen={open} onRequestClose={()=>setOpen(false)}>
      <h2>Premium — ₹99</h2>
      <p>Get ad-free listening and extra features.</p>

      <div style={{display:'flex',gap:10}}>
        <button onClick={purchase} disabled={loading}>{loading ? 'Processing...' : 'Pay with Card / UPI (mock)'}</button>
        <button onClick={()=> setOpen(false)}>Cancel</button>
      </div>
    </Modal>
  );
}
