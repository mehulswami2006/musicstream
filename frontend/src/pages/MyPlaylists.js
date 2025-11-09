// frontend/src/pages/MyPlaylists.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function MyPlaylists() {
  const { token } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPublic, setNewPublic] = useState(false);
  const [addSongOpen, setAddSongOpen] = useState(false);
  const [targetPlaylist, setTargetPlaylist] = useState(null);
  const [songData, setSongData] = useState({ url: '', title: '', artist: '', cover: '' });

  const api = process.env.REACT_APP_API;

  const fetchMine = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${api}/api/playlists/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
      setPlaylists([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMine(); }, [token]);

  const createPlaylist = async () => {
    if (!newName) return alert('Name required');
    try {
      const res = await axios.post(`${api}/api/playlists`, { name: newName, public: newPublic }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(p => [res.data, ...p]);
      setCreateOpen(false); setNewName(''); setNewPublic(false);
    } catch (err) {
      console.error(err); alert('Failed to create');
    }
  };

  const openAddSong = (pl) => { setTargetPlaylist(pl); setAddSongOpen(true); setSongData({ url:'', title:'', artist:'', cover:'' }); };

  const addSongToPlaylist = async () => {
    if (!songData.url) return alert('Song URL required');
    try {
      await axios.post(`${api}/api/playlists/${targetPlaylist._id}/song`, songData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMine();
      setAddSongOpen(false);
    } catch (err) {
      console.error(err); alert('Failed to add song');
    }
  };

  const toggleVisibility = async (pl) => {
    try {
      const res = await axios.put(`${api}/api/playlists/${pl._id}/visibility`, { public: !pl.public }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(list => list.map(x => x._id === pl._id ? res.data : x));
    } catch (err) {
      console.error(err); alert('Failed to update visibility');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Playlists</h2>
      <button onClick={() => setCreateOpen(true)}>Create Playlist</button>
      {loading ? <p>Loading...</p> : (
        <div style={{ marginTop: 12 }}>
          {playlists.length === 0 ? <p>No playlists yet</p> :
            playlists.map(pl => (
              <div key={pl._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{pl.name} {pl.public ? <small>(Public)</small> : <small>(Private)</small>}</h3>
                    <p>{pl.songs?.length || 0} songs</p>
                  </div>
                  <div>
                    <button onClick={() => openAddSong(pl)}>Add Song</button>
                    <button onClick={() => toggleVisibility(pl)}>{pl.public ? 'Make Private' : 'Make Public'}</button>
                  </div>
                </div>

                {pl.songs && pl.songs.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {pl.songs.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                        {s.cover ? <img src={s.cover} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} /> : null}
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.title}</div>
                          <div style={{ fontSize: 13 }}>{s.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal isOpen={createOpen} onRequestClose={() => setCreateOpen(false)}>
        <h3>Create Playlist</h3>
        <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
        <div>
          <label>
            <input type="checkbox" checked={newPublic} onChange={e => setNewPublic(e.target.checked)} /> Public
          </label>
        </div>
        <button onClick={createPlaylist}>Create</button>
        <button onClick={() => setCreateOpen(false)}>Cancel</button>
      </Modal>

      {/* Add Song Modal */}
      <Modal isOpen={addSongOpen} onRequestClose={() => setAddSongOpen(false)}>
        <h3>Add song to: {targetPlaylist?.name}</h3>
        <input placeholder="Song URL (mp3 URL)" value={songData.url} onChange={e => setSongData({ ...songData, url: e.target.value })} />
        <input placeholder="Title (optional)" value={songData.title} onChange={e => setSongData({ ...songData, title: e.target.value })} />
        <input placeholder="Artist (optional)" value={songData.artist} onChange={e => setSongData({ ...songData, artist: e.target.value })} />
        <input placeholder="Cover URL (optional)" value={songData.cover} onChange={e => setSongData({ ...songData, cover: e.target.value })} />
        <div style={{ marginTop: 8 }}>
          <button onClick={addSongToPlaylist}>Add</button>
          <button onClick={() => setAddSongOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
