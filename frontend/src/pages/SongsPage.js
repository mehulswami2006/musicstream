// frontend/src/pages/SongsPage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { QueueContext } from '../contexts/QueueContext';
import { AuthContext } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

export default function SongsPage() {
  const api = process.env.REACT_APP_API || '';
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const { token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // detect guest mode from query param (optional)
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
    // replace queue with this single song and play
    replaceQueueAndPlay([song], 0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Songs</h2>
      {loading ? (
        <p>Loading songs…</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
          gap: 12
        }}>
          {songs.length === 0 ? (
            <div>No songs available</div>
          ) : (
            songs.map((s, i) => (
              <SongCard
                key={i}
                song={s}
                onAdd={() => addToQueue({
                  title: s.title,
                  artist: s.artist,
                  url: s.url.startsWith('http') ? s.url : (api + s.url),
                  cover: s.cover && (s.cover.startsWith('http') ? s.cover : (api + s.cover))
                })}
                onPlay={() => playNow({
                  title: s.title,
                  artist: s.artist,
                  url: s.url.startsWith('http') ? s.url : (api + s.url),
                  cover: s.cover && (s.cover.startsWith('http') ? s.cover : (api + s.cover))
                })}
                token={token}
                guest={guest}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

