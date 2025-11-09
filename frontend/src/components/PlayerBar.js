// frontend/src/components/PlayerBar.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import './PlayerBar.css';
import { QueueContext } from '../contexts/QueueContext';

export default function PlayerBar() {
  const {
    queue, currentIndex, playing, setPlaying,
    audioRef, next, prev
  } = useContext(QueueContext);

  const audioElRef = useRef(null);

  // make sure audioRef from context points to our element
  useEffect(() => {
    if (audioRef) audioRef.current = audioElRef.current;
  }, [audioRef]);

  const current = queue && queue[currentIndex] ? queue[currentIndex] : null;
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (!audioElRef.current) return;
    const a = audioElRef.current;

    const onTime = () => {
      if (!seeking) setProgress(a.currentTime || 0);
      setDuration(a.duration || 0);
    };
    const onEnded = () => {
      next();
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    a.addEventListener('loadedmetadata', onTime);

    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('loadedmetadata', onTime);
    };
  }, [next, seeking]);

  useEffect(() => {
    if (!audioElRef.current) return;
    const a = audioElRef.current;
    if (current && current.url) {
      a.src = current.url;
      a.load();
      if (playing) {
        a.play().catch(() => {/* may be blocked if not user gesture */});
      }
    } else {
      a.pause();
      a.removeAttribute('src');
      setProgress(0);
      setDuration(0);
    }
  }, [current, playing]);

  useEffect(() => {
    if (!audioElRef.current) return;
    if (playing) audioElRef.current.play().catch(() => {});
    else audioElRef.current.pause();
  }, [playing]);

  const togglePlay = () => setPlaying(p => !p);

  const seekTo = (value) => {
    if (!audioElRef.current) return;
    audioElRef.current.currentTime = value;
    setProgress(value);
  };

  const formatTime = (t = 0) => {
    if (!t || isNaN(t)) return '0:00';
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="player-bar">
      <div className="now-playing">
        {current ? (
          <>
            <img className="now-cover" src={current.cover} alt={current.title} />
            <div className="now-meta">
              <div className="now-title">{current.title}</div>
              <div className="now-artist muted">{current.artist}</div>
            </div>
          </>
        ) : (
          <div className="now-meta">No song playing</div>
        )}
      </div>

      <div className="controls">
        <button onClick={prev} aria-label="previous">Prev</button>
        <button onClick={() => {
          if (!current) return;
          // rewind 10s
          if (audioElRef.current) audioElRef.current.currentTime = Math.max(0, (audioElRef.current.currentTime || 0) - 10);
        }}>-10s</button>

        <button onClick={togglePlay} aria-label="play-pause">{playing ? 'Pause' : 'Play'}</button>

        <button onClick={() => {
          if (!current) return;
          if (audioElRef.current) audioElRef.current.currentTime = Math.min((audioElRef.current.duration || 0), (audioElRef.current.currentTime || 0) + 10);
        }}>+10s</button>
        <button onClick={next} aria-label="next">Next</button>

        <div className="time">{formatTime(progress)}</div>

        <input
          type="range"
          className="seek"
          min={0}
          max={Math.max(0, duration)}
          step="0.1"
          value={progress}
          onChange={e => seekTo(Number(e.target.value))}
          onMouseDown={() => setSeeking(true)}
          onMouseUp={() => setSeeking(false)}
        />

        <div className="time">{formatTime(duration)}</div>
      </div>

      <audio ref={audioElRef} />
    </div>
  );
}
