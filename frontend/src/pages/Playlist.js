import React, { useState, useEffect } from "react";
import "./Playlist.css";

const Playlist = () => {
  const [playlists, setPlaylists] = useState(() => {
    return JSON.parse(localStorage.getItem("playlists")) || [];
  });
  const [newName, setNewName] = useState("");

  const createPlaylist = () => {
    if (!newName) return;
    const updated = [...playlists, { name: newName, songs: [] }];
    setPlaylists(updated);
    localStorage.setItem("playlists", JSON.stringify(updated));
    setNewName("");
  };

  const deletePlaylist = (index) => {
    const updated = playlists.filter((_, idx) => idx !== index);
    setPlaylists(updated);
    localStorage.setItem("playlists", JSON.stringify(updated));
  };

  return (
    <div className="playlist-page">
      <h2>Your Playlists</h2>
      <div className="create-playlist">
        <input
          type="text"
          placeholder="New Playlist Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={createPlaylist}>Create</button>
      </div>
      <div className="playlist-list">
        {playlists.map((pl, idx) => (
          <div key={idx} className="playlist-card">
            <h3>{pl.name}</h3>
            <p>{pl.songs.length} songs</p>
            <div className="playlist-songs">
              {pl.songs.map((song, songIdx) => (
                <div key={songIdx} className="playlist-song">
                  <span>{song.title}</span>
                </div>
              ))}
            </div>
            <button onClick={() => deletePlaylist(idx)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
