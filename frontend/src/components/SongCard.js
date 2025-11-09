// frontend/src/components/SongCard.js
import React from 'react';
import PropTypes from 'prop-types';
import './SongCard.css';
import { useContext } from 'react';
import { QueueContext } from '../contexts/QueueContext';

export default function SongCard({ song, onAdd, onPlay, small }) {
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const api = (process.env.REACT_APP_API || '').replace(/\/$/, '');

  const ensureAbsolute = (u) => {
    if (!u) return u;
    if (/^https?:\/\//i.test(u)) return u;
    return api + (u.startsWith('/') ? u : `/${u}`);
  };

  const playHandler = () => {
    if (onPlay) return onPlay();
    const s = { ...song, url: ensureAbsolute(song.url), cover: song.cover ? ensureAbsolute(song.cover) : undefined };
    replaceQueueAndPlay([s], 0);
  };

  const addHandler = () => {
    if (onAdd) return onAdd();
    const s = { ...song, url: ensureAbsolute(song.url), cover: song.cover ? ensureAbsolute(song.cover) : undefined };
    enqueue(s);
    // non-blocking feedback
    console.log('Added to queue:', s.title);
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
    <article className="song-card" aria-label={song.title}>
      <div className="song-cover-wrap">
        {song.cover ? (
          <img className="song-cover" src={song.cover} alt={song.title} />
        ) : (
          <div className="song-cover placeholder">{song.title ? song.title[0].toUpperCase() : '?'}</div>
        )}
      </div>

      <div className="song-meta">
        <div className="title">{song.title}</div>
        <div className="artist muted">{song.artist}</div>

        <div className="song-actions">
          <button className="btn-play" onClick={playHandler}>Play</button>
          <button className="btn-add" onClick={addHandler}>Add</button>
          <button className="btn-info" onClick={infoHandler}>Info</button>
        </div>
      </div>
    </article>
  );
}

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  onPlay: PropTypes.func,
  small: PropTypes.bool
};
