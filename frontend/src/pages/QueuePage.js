// src/pages/QueuePage.js
import React, { useContext, useEffect } from 'react';
import { QueueContext } from '../contexts/QueueContext';

export default function QueuePage(){
  const { queue, currentIndex, playNext, audioRef } = useContext(QueueContext);

  useEffect(()=> {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => playNext();
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [audioRef, playNext]);

  return (
    <div style={{padding:20}}>
      <h2>Queue</h2>
      <audio ref={audioRef} controls style={{width:'100%'}} />
      <ul>
        {queue.map((s, i) => <li key={i} style={{fontWeight:i===currentIndex?'bold':'normal'}}>{s.title} - {s.artist}</li>)}
      </ul>
    </div>
  );
}
