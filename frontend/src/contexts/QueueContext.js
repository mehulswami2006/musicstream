// frontend/src/contexts/QueueContext.js
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const QueueContext = createContext({
  queue: [],
  currentIndex: -1,
  playing: false,
  enqueue: () => {},
  replaceQueueAndPlay: () => {},
  playIndex: () => {},
  next: () => {},
  prev: () => {}
});

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([]); // array of {title, artist, url, cover}
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);

  // We expose a ref to the audio element via window so PlayerBar can connect OR we keep functions
  const audioRef = useRef(null);

  // enqueue at end
  const enqueue = useCallback((song) => {
    setQueue(q => [...q, song]);
  }, []);

  // replace entire queue and start at index
  const replaceQueueAndPlay = useCallback((songs, startIndex = 0) => {
    setQueue(songs || []);
    setCurrentIndex(startIndex);
    setPlaying(true);
  }, []);

  const playIndex = useCallback((index) => {
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    setPlaying(true);
  }, [queue.length]);

  const next = useCallback(() => {
    setCurrentIndex(i => {
      const nextIndex = i + 1;
      if (nextIndex >= queue.length) {
        // reached end — stop
        setPlaying(false);
        return i;
      }
      setPlaying(true);
      return nextIndex;
    });
  }, [queue.length]);

  const prev = useCallback(() => {
    setCurrentIndex(i => {
      const prevIndex = i - 1;
      if (prevIndex < 0) return i;
      setPlaying(true);
      return prevIndex;
    });
  }, []);

  // When currentIndex or playing changes, tell audio element to load/play (PlayerBar handles actual audio)
  // We'll store player state in local storage so page reload keeps queue for demo (optional)
  useEffect(() => {
    try {
      localStorage.setItem('musicstream_queue', JSON.stringify({ queue, currentIndex }));
    } catch (e) { /* ignore */ }
  }, [queue, currentIndex]);

  // expose context value
  const value = {
    queue,
    currentIndex,
    playing,
    setPlaying,
    audioRef,
    enqueue,
    replaceQueueAndPlay,
    playIndex,
    next,
    prev,
    setQueue
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
}
