// src/contexts/QueueContext.js
import React, { createContext, useState, useRef } from 'react';
export const QueueContext = createContext();

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([]); // array of song objects {title, artist, url, cover}
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const playSongAt = (index) => {
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    if (audioRef.current) {
      audioRef.current.src = queue[index].url;
      audioRef.current.play().catch(()=>{ /* handle play error */ });
    }
  };

  const playNext = () => {
    if (currentIndex + 1 < queue.length) {
      playSongAt(currentIndex + 1);
    }
  };

  const enqueue = (song) => setQueue(q => [...q, song]);

  const replaceQueueAndPlay = (songs, start = 0) => {
    setQueue(songs);
    setTimeout(()=> playSongAt(start), 100); // short delay
  };

  return (
    <QueueContext.Provider value={{
      queue, setQueue, currentIndex, setCurrentIndex,
      playSongAt, playNext, enqueue, replaceQueueAndPlay, audioRef
    }}>
      {children}
    </QueueContext.Provider>
  );
}
