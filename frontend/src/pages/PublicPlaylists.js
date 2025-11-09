// frontend/src/pages/PublicPlaylists.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { QueueContext } from '../contexts/QueueContext';
import { AuthContext } from '../contexts/AuthContext';

export default function PublicPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const { enqueue, replaceQueueAndPlay } = useContext(QueueContext);
  const { token } = useContext(AuthContext);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    axios.get(`${api}/api/playlists/public`)
      .then(res => setPlaylists(res.data))
      .catch(err => { console.error(err); setPlaylists([]); });
  }, []);

  const addPlaylistToQueue = (pl) => {
    const songs = (pl.songs || []).map(s => ({ title: s.title, artist: s.artist, url: s.url, cover: s.cover }));
    replaceQueueAndPlay(songs, 0);
  };

  const enqueueSong = (song) => enqueue(song);

  return (
    <div style={{ padding: 20 }}>
      <h2>Public Playlists</h2>
      {playlists.length === 0 ? <p>No public playlists yet</p> :
        playlists.map(pl => (
          <div key={pl._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{pl.name}</h3>
                <div style={{ fontSize: 13 }}>By: {pl.owner?.name || 'Unknown'}</div>
                <div style={{ fontSize: 12 }}>{pl.songs?.length || 0} songs</div>
              </div>
              <div>
                <button onClick={() => addPlaylistToQueue(pl)}>Play Now</button>
              </div>
            </div>

            {pl.songs && pl.songs.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {pl.songs.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                    {s.cover ? <img src={s.cover} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} /> : null}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      <div style={{ fontSize: 13 }}>{s.artist}</div>
                    </div>
                    <div>
                      <button onClick={() => enqueueSong({ title: s.title, artist: s.artist, url: s.url, cover: s.cover })}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
}
