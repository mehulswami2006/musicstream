// frontend/src/components/PlayerBar.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { QueueContext } from '../contexts/QueueContext';

export default function PlayerBar() {
  const {
    queue, currentIndex, playing, setPlaying,
    audioRef, next, prev, setQueue
  } = useContext(QueueContext);

  const audioEl = audioRef.current || useRef(null);
  // ensure audioRef.current points to this audio element
  useEffect(() => {
    if (!audioRef.current) audioRef.current = audioEl.current;
  }, [audioEl, audioRef]);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const current = queue && queue[currentIndex] ? queue[currentIndex] : null;
  const src = current ? current.url : null;

  // load new src into audio element when current changes
  useEffect(() => {
    if (!audioEl.current) return;
    if (src) {
      audioEl.current.src = src;
      audioEl.current.load();
      if (playing) {
        const p = audioEl.current.play().catch(err => {
          // autoplay may be blocked in some browsers; just ignore
          console.warn('Play prevented:', err);
        });
      }
    } else {
      // no source => pause and reset
      audioEl.current.pause();
      audioEl.current.removeAttribute('src');
      setProgress(0);
      setDuration(0);
    }
  }, [src, playing, audioEl]);

  // play/pause effect
  useEffect(() => {
    if (!audioEl.current) return;
    if (playing) {
      audioEl.current.play().catch(err => console.warn('play error', err));
    } else {
      audioEl.current.pause();
    }
  }, [playing, audioEl]);

  useEffect(() => {
    const a = audioEl.current;
    if (!a) return;

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
  }, [next, seeking, audioEl]);

  const togglePlay = () => setPlaying(p => !p);

  const seekTo = (value) => {
    if (!audioEl.current) return;
    audioEl.current.currentTime = value;
    setProgress(value);
  };

  const rewind10 = () => {
    if (!audioEl.current) return;
    seekTo(Math.max(0, audioEl.current.currentTime - 10));
  };
  const forward10 = () => {
    if (!audioEl.current) return;
    seekTo(Math.min(audioEl.current.duration || 0, audioEl.current.currentTime + 10));
  };

  const formatTime = (t = 0) => {
    if (!t || isNaN(t)) return '0:00';
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!current) {
    // hidden bar when no song, but still render audio to allow queue to be set externally
    return (
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, background: '#fff', borderTop: '1px solid #eee',
        padding: 8, display: 'flex', alignItems: 'center', gap: 12
      }}>
        <div style={{ flex: 1 }}>No song playing</div>
        <audio ref={audioEl} />
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, background: '#fff', borderTop: '1px solid #eee',
      padding: 8, display: 'flex', alignItems: 'center', gap: 12, zIndex: 9999
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {current.cover ? <img src={current.cover} alt={current.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ width: 56, height: 56, background: '#f4f4f4', borderRadius: 6 }} />}
        <div>
          <div style={{ fontWeight: 700 }}>{current.title}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{current.artist}</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prev}>Prev</button>
          <button onClick={rewind10}>-10s</button>
          <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
          <button onClick={forward10}>+10s</button>
          <button onClick={next}>Next</button>

          <div style={{ marginLeft: 12, minWidth: 60 }}>{formatTime(progress)}</div>

          <input
            aria-label="seek"
            type="range"
            min={0}
            max={Math.max(0, duration)}
            step="0.1"
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
            onMouseDown={() => setSeeking(true)}
            onMouseUp={() => setSeeking(false)}
            style={{ width: '40%' }}
          />

          <div style={{ minWidth: 60, textAlign: 'right' }}>{formatTime(duration)}</div>
        </div>
      </div>

      <audio ref={audioEl} style={{ display: 'none' }} />
    </div>
  );
}
