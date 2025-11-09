// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

/* ---------- Config ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musicstream';

/* ---------- MongoDB connect ---------- */
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  // keep server running so static routes still work; comment out next line if you prefer to exit
  // process.exit(1);
});

/* ---------- Middleware ---------- */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

/* ---------- Uploads (Multer) ---------- */
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function safeFilename(original) {
  const timestamp = Date.now();
  const base = path.basename(original).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '');
  return `${timestamp}_${base}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname))
});
const upload = multer({ storage });

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(UPLOAD_DIR));

/* ---------- Songs array & endpoints (keeps original behavior) ---------- */
let songs = [
  { title: "Danza Kuduro", artist: "Don Omar", cover: "/uploads/cover1.jpg", url: "/uploads/danza_kuduro.mp3" },
  { title: "Despacito", artist: "Luis Fonsi", cover: "/uploads/cover2.jpg", url: "/uploads/despacito.mp3" },
  { title: "Fly Away", artist: "Lenny Kravitz", cover: "/uploads/cover3.jpg", url: "/uploads/fly_away.mp3" },
  { title: "Gasolina", artist: "Daddy Yankee", cover: "/uploads/cover4.jpg", url: "/uploads/gasolina.mp3" },
  { title: "Grateful", artist: "DJ Khaled", cover: "/uploads/cover5.jpg", url: "/uploads/grateful.mp3" },
  { title: "I Can Feel It", artist: "DJ Snake", cover: "/uploads/cover6.jpg", url: "/uploads/i_can_feel_it.mp3" },
  { title: "Perfect", artist: "Ed Sheeran", cover: "/uploads/cover7.jpg", url: "/uploads/perfect.mp3" },
  { title: "Shape Of You", artist: "Ed Sheeran", cover: "/uploads/cover8.jpg", url: "/uploads/Shape_Of_You.mp3" }
];

app.get('/api/songs', (req, res) => res.json(songs));

app.post('/api/upload', upload.fields([{ name: 'song' }, { name: 'cover' }]), (req, res) => {
  try {
    const songFile = req.files && req.files['song'] && req.files['song'][0];
    const coverFile = req.files && req.files['cover'] && req.files['cover'][0];
    const { title, artist } = req.body;

    if (!songFile || !coverFile || !title || !artist) {
      return res.status(400).json({ success: false, message: 'song, cover, title and artist are required' });
    }

    const newSong = {
      title,
      artist,
      cover: `/uploads/${coverFile.filename}`,
      url: `/uploads/${songFile.filename}`
    };
    songs.push(newSong);
    return res.json({ success: true, song: newSong });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ---------- Mount route files (exact casing) ---------- */
function tryUseRoute(mountPath, requirePath) {
  try {
    const rt = require(requirePath);
    app.use(mountPath, rt);
    console.log(`Mounted ${requirePath} at ${mountPath}`);
  } catch (err) {
    console.warn(`Warning: failed to mount ${requirePath} at ${mountPath}. Make sure the file exists and uses exact casing.`);
    console.warn(err.message);
  }
}

// Mount routes — ensure these files exist with exact filenames and exact internal imports
tryUseRoute('/api/auth', './routes/auth');           // backend/routes/auth.js
tryUseRoute('/api/playlists', './routes/playlists'); // backend/routes/playlists.js
tryUseRoute('/api/payment', './routes/payment');     // backend/routes/payment.js

/* ---------- Root ---------- */
app.get('/', (req, res) => {
  res.send('🎵 MusicStream backend is running successfully!');
});

/* ---------- Start ---------- */
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
