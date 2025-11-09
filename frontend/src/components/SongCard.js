// frontend/src/components/SongCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { QueueContext } from '../contexts/QueueContext';

export default function SongCard({ song, onAdd, onPlay, small }) {
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const api = (process.env.REACT_APP_API || '').replace(/\/$/, '');

  function ensureAbsolute(u) {
    if (!u) return u;
    if (/^https?:\/\//i.test(u)) return u;
    return api + (u.startsWith('/') ? u : `/${u}`);
  }

  const playHandler = () => {
    if (onPlay) return onPlay();
    const s = { ...song, url: ensureAbsolute(song.url), cover: song.cover ? ensureAbsolute(song.cover) : undefined };
    replaceQueueAndPlay([s], 0);
  };

  const addHandler = () => {
    if (onAdd) return onAdd();
    const s = { ...song, url: ensureAbsolute(song.url), cover: song.cover ? ensureAbsolute(song.cover) : undefined };
    enqueue(s);
    console.log('Added to queue', s.title);
  };

  const infoHandler = () => {
    const info = [
      `Title: ${song.title || 'Unknown'}`,
      `Artist: ${song.artist || 'Unknown'}`,
      `URL: ${song.url || 'N/A'}`,
      song.createdAt ? `Created: ${new Date(song.createdAt).toLocaleString()}` : ''
    ].filter(Boolean).join('\n');
    alert(info);
  };

  return (
    <div style={{
      border: '1px solid #e6e6e6',
      padding: 10,
      borderRadius: 8,
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ width: small ? 56 : 96, height: small ? 56 : 96, flex: '0 0 auto' }}>
        {song.cover ? (
          <img src={song.cover} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f4f4f4', borderRadius: 6, color: '#666'
          }}>{song.title ? song.title[0].toUpperCase() : '?'}</div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{song.title}</div>
        <div style={{ color: '#666', fontSize: 13 }}>{song.artist}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button onClick={playHandler}>Play</button>
          <button onClick={addHandler}>Add</button>
          <button onClick={infoHandler}>Info</button>
        </div>
      </div>
    </div>
  );
}

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  onPlay: PropTypes.func,
  small: PropTypes.bool
};
