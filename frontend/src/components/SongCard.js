// frontend/src/components/SongCard.js
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './SongCard.css';
import { QueueContext } from '../contexts/QueueContext';

export default function SongCard({ song, onAdd, onPlay, small = false }) {
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);

  // If parent didn't give handlers, use queue context
  const playHandler = () => {
    if (typeof onPlay === 'function') return onPlay();
    const s = normalize(song);
    replaceQueueAndPlay([s], 0);
  };

  const addHandler = () => {
    if (typeof onAdd === 'function') return onAdd();
    const s = normalize(song);
    enqueue(s);
    // small, unobtrusive feedback
    try { window?.toast?.push?.(`${s.title} added to queue`); } catch(e) {}
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

  function normalize(s) {
    return {
      title: s.title || 'Unknown',
      artist: s.artist || 'Unknown',
      url: s.url || '',
      cover: s.cover || ''
    };
  }

  const coverSrc = song.cover || ''; // SongsPage should supply absolute URLs already
  const fallbackCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><rect width="100%" height="100%" fill="%23131313"/><text x="50%" y="50%" font-size="72" fill="%23b3b3b3" text-anchor="middle" dominant-baseline="middle">No Art</text></svg>';

  return (
    <article className={`song-card ${small ? 'song-card--small' : ''}`} aria-label={song.title || 'song'}>
      <div className="song-art" onDoubleClick={playHandler}>
        <img
          src={coverSrc || fallbackCover}
          alt={song.title ? `${song.title} cover` : 'No cover'}
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackCover; }}
          className="song-art-img"
        />

        <button
          className="play-overlay"
          aria-label={`Play ${song.title || 'song'}`}
          onClick={playHandler}
          title="Play"
        >
          {/* simple play icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 3v18l15-9L5 3z" fill="#000"/>
          </svg>
        </button>
      </div>

      <div className="song-info">
        <div className="song-title" title={song.title}>{song.title}</div>
        <div className="song-artist muted" title={song.artist}>{song.artist}</div>

        <div className="song-controls">
          <button className="btn btn-play" onClick={playHandler}>Play</button>
          <button className="btn btn-add" onClick={addHandler}>Add</button>
          <button className="btn btn-info" onClick={infoHandler}>Info</button>
        </div>
      </div>
    </article>
  );
}

SongCard.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    url: PropTypes.string,
    cover: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired,
  onAdd: PropTypes.func,
  onPlay: PropTypes.func,
  small: PropTypes.bool
};
