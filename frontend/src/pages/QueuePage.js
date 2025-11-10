// frontend/src/pages/QueuePage.js
import React, { useContext } from 'react';
import { QueueContext } from '../contexts/QueueContext';
import './QueuePage.css';

export default function QueuePage() {
  const { queue, setQueue } = useContext(QueueContext);

  const clearQueue = () => {
    if (!queue || queue.length === 0) return;
    if (window.confirm('Clear the entire queue?')) {
      setQueue([]);
    }
  };

  return (
    <div className="queue-page">
      <div className="queue-header">
        <h2 className="queue-title">Your Queue</h2>
        {queue && queue.length > 0 && (
          <button className="clear-queue-btn" onClick={clearQueue}>
            Clear Queue
          </button>
        )}
      </div>

      {(!queue || queue.length === 0) ? (
        <p className="empty-queue">No songs in queue yet. Add some from the Songs page 🎶</p>
      ) : (
        <ul className="queue-list">
          {queue.map((s, i) => (
            <li key={i} className="queue-item">
              <div className="queue-cover">
                {s.cover ? (
                  <img src={s.cover} alt={s.title} onError={(e)=>{ e.target.onerror=null; e.target.src='/assets/MusicStreamLogo.png'; }} />
                ) : (
                  <div className="placeholder">{s.title ? s.title[0].toUpperCase() : '?'}</div>
                )}
              </div>
              <div className="queue-info">
                <div className="queue-song-title">{s.title}</div>
                <div className="queue-song-artist">{s.artist}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
