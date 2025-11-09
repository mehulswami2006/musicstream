// frontend/src/pages/SongsPage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { QueueContext } from '../contexts/QueueContext';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import './SongsPage.css';

export default function SongsPage() {
  const api = (process.env.REACT_APP_API || '').replace(/\/$/, '');
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const { token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const guest = searchParams.get('guest') === 'true';

  function makeAbsolute(url) {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return api + (url.startsWith('/') ? url : `/${url}`);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(`${api}/api/songs`);
        if (cancelled) return;
        const normalized = (res.data || []).map(s => ({
          ...s,
          url: makeAbsolute(s.url),
          cover: s.cover ? makeAbsolute(s.cover) : undefined
        }));
        setSongs(normalized);
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
  };

  const playNow = (song) => {
    replaceQueueAndPlay([song], 0);
  };

  return (
    <div className="container songs-page">
      <h2>All Songs</h2>

      {loading ? <p className="muted">Loading songs…</p> : null}

      <div className="songs-grid">
        {songs.length === 0 && !loading ? <div className="card">No songs available</div> : songs.map((s, i) => (
          <SongCard
            key={i}
            song={s}
            onAdd={() => addToQueue(s)}
            onPlay={() => playNow(s)}
            token={token}
            guest={guest}
          />
        ))}
      </div>
    </div>
  );
}
