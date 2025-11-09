const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upload song
router.post('/upload', upload.single('song'), async (req, res) => {
  try {
    const newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      cover: req.body.cover || '/uploads/cover1.jpg',
      url: '/uploads/' + req.file.filename
    });
    const saved = await newSong.save();
    res.json(saved);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
