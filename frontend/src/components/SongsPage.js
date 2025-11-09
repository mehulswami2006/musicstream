// src/pages/SongsPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { QueueContext } from '../contexts/QueueContext';
import { AuthContext } from '../contexts/AuthContext';

export default function SongsPage(){
  const [songs, setSongs] = useState([]);
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const { token } = useContext(AuthContext);

  useEffect(()=> {
    axios.get(process.env.REACT_APP_API + '/api/songs')
      .then(r => setSongs(r.data))
      .catch(()=> setSongs([]));
  }, []);

  const addToQueue = (song) => enqueue(song);
  const playNow = (song) => replaceQueueAndPlay([song], 0);

  return (
    <div style={{padding:20}}>
      <h2>Songs</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
        {songs.map((s, i) => <SongCard key={i} song={s} onAdd={()=>addToQueue(s)} onPlay={()=>playNow(s)} token={token} />)}
      </div>
    </div>
  );
}
