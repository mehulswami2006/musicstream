// src/components/SongCard.js
import React, { useContext, useState } from 'react';
import { QueueContext } from '../contexts/QueueContext';
import Modal from 'react-modal';

export default function SongCard({ song, onAdd, onPlay, token }) {
  const { enqueue, replaceQueueAndPlay, audioRef, playSongAt } = useContext(QueueContext);
  const [showInfo, setShowInfo] = useState(false);
  const [isQuickLoading, setQuickLoading] = useState(false);

  const handlePlay = () => {
    setQuickLoading(true);
    setTimeout(()=> {
      setQuickLoading(false);
      onPlay();
    }, 500); // 0.5s mini loader for non-song button actions (requirement #4)
  };

  return (
    <div style={{border:'1px solid #ddd',borderRadius:8,padding:10}}>
      <img src={song.cover} alt="" style={{width:'100%',height:140,objectFit:'cover'}} />
      <h4>{song.title}</h4>
      <p>{song.artist}</p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={handlePlay}>{isQuickLoading ? 'Loading...' : 'Play'}</button>
        <button onClick={() => onAdd()}>Add to Queue</button>
        <button onClick={()=> setShowInfo(true)}>Info</button>
      </div>

      <Modal isOpen={showInfo} onRequestClose={()=>setShowInfo(false)} ariaHideApp={false}>
        <h3>{song.title}</h3>
        <p>Artist: {song.artist}</p>
        <p>Source: {song.url}</p>
        <p>Uploaded: Not available</p>
        <button onClick={()=>setShowInfo(false)}>Close</button>
      </Modal>
    </div>
  );
}
