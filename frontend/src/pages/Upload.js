import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://musicstream-92cd.onrender.com';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !artist || !songFile || !coverFile) {
      setMessage('Please fill all fields and select files.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('song', songFile);
    formData.append('cover', coverFile);

    axios.post(`${BACKEND_URL}/api/upload`, formData)
      .then(res => {
        setMessage('Song uploaded successfully!');
        setTitle(''); setArtist(''); setSongFile(null); setCoverFile(null);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error uploading song.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload a Song</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Artist:</label><br />
          <input type="text" value={artist} onChange={e => setArtist(e.target.value)} />
        </div>
        <div>
          <label>Song File:</label><br />
          <input type="file" accept=".mp3" onChange={e => setSongFile(e.target.files[0])} />
        </div>
        <div>
          <label>Cover Image:</label><br />
          <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Upload;
