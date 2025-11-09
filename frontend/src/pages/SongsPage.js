// frontend/src/pages/SongsPage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { QueueContext } from '../contexts/QueueContext';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import './SongsPage.css';

export default function SongsPage() {
  // 👇 Ensure this points to your Render backend
  const api = process.env.REACT_APP_API || 'https://musicstream-rur2.onrender.com';
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const { token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const guest = searchParams.get('guest') === 'true';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(`${api}/api/songs`);
        if (!cancelled) setSongs(res.data || []);
      } catch (err) {
        console.error('Failed to load songs', err);
        if (!cancelled) setSongs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [api]);

  const addToQueue = (song) => {
    enqueue(song);
    alert('Added to queue');
  };

  const playNow = (song) => {
    replaceQueueAndPlay([song], 0);
  };

  return (
    <div className="songs-page">
      <h2>Songs</h2>
      {loading ? (
        <p>Loading songs…</p>
      ) : (
        <div className="songs-grid">
          {songs.length === 0 ? (
            <div>No songs available</div>
          ) : (
            songs.map((s, i) => {
              // Ensure full URLs for backend-hosted files
              const songUrl = s.url?.startsWith('http') ? s.url : `${api}${s.url}`;
              const coverUrl = s.cover?.startsWith('http') ? s.cover : `${api}${s.cover}`;
              return (
                <SongCard
                  key={i}
                  song={{ ...s, url: songUrl, cover: coverUrl }}
                  onAdd={() => addToQueue({ ...s, url: songUrl, cover: coverUrl })}
                  onPlay={() => playNow({ ...s, url: songUrl, cover: coverUrl })}
                  token={token}
                  guest={guest}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
