// src/pages/Choice.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Choice(){
  const nav = useNavigate();
  const handleGuest = ()=> nav('/songs?guest=true');

  return (
    <div style={{padding:20}}>
      <h2>Welcome to MusicStream</h2>
      <div style={{display:'flex',gap:10, marginTop:20}}>
        <button onClick={()=>nav('/login')}>Login / Register</button>
        <button onClick={handleGuest}>Use without Login</button>
      </div>
    </div>
  );
}
