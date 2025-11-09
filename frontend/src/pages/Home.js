import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const staticSongs = [
  { title: "Danza Kuduro", artist: "Don Omar", cover: "https://musicstream-92cd.onrender.com/uploads/cover1.jpg", url: "https://musicstream-92cd.onrender.com/uploads/danza_kuduro.mp3" },
  { title: "Despacito", artist: "Luis Fonsi", cover: "https://musicstream-92cd.onrender.com/uploads/cover2.jpg", url: "https://musicstream-92cd.onrender.com/uploads/despacito.mp3" },
  { title: "Fly Away", artist: "Lenny Kravitz", cover: "https://musicstream-92cd.onrender.com/uploads/cover3.jpg", url: "https://musicstream-92cd.onrender.com/uploads/fly_away.mp3" },
  { title: "Gasolina", artist: "Daddy Yankee", cover: "https://musicstream-92cd.onrender.com/uploads/cover4.jpg", url: "https://musicstream-92cd.onrender.com/uploads/gasolina.mp3" },
  { title: "Grateful", artist: "DJ Khaled", cover: "https://musicstream-92cd.onrender.com/uploads/cover5.jpg", url: "https://musicstream-92cd.onrender.com/uploads/grateful.mp3" },
  { title: "I Can Feel It", artist: "DJ Snake", cover: "https://musicstream-92cd.onrender.com/uploads/cover6.jpg", url: "https://musicstream-92cd.onrender.com/uploads/i_can_feel_it.mp3" },
  { title: "Perfect", artist: "Ed Sheeran", cover: "https://musicstream-92cd.onrender.com/uploads/cover7.jpg", url: "https://musicstream-92cd.onrender.com/uploads/perfect.mp3" },
  { title: "Shape Of You", artist: "Ed Sheeran", cover: "https://musicstream-92cd.onrender.com/uploads/cover8.jpg", url: "https://musicstream-92cd.onrender.com/uploads/Shape_Of_You.mp3" }
];

const Home = () => {
  const [songs, setSongs] = useState(staticSongs);

  // Fetch songs from Render backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://musicstream-92cd.onrender.com/api/songs');
        setSongs(response.data.map(song => ({
          ...song,
          cover: `https://musicstream-92cd.onrender.com${song.cover}`,
          url: `https://musicstream-92cd.onrender.com${song.url}`
        })));
      } catch (error) {
        console.error('Backend not available, using static songs:', error);
        setSongs(staticSongs);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
    const event = new CustomEvent("playSong", { detail: song });
    window.dispatchEvent(event);
  };

  return (
    <div className="home">
      <h2>Recommended Songs</h2>
      <div className="song-grid">
        {songs.map((song, idx) => (
          <div key={idx} className="song-card" onClick={() => handlePlay(song)}>
            <img src={song.cover} alt={song.title} className="song-cover" />
            <p className="song-title">{song.title}</p>
            <p className="song-artist">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;