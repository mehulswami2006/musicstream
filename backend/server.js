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
  // keep server running for static routes if desired
});

/* ---------- Try to load Song model (fallback to in-memory if missing) ---------- */
let Song = null;
try {
  Song = require('./models/Song'); // expects backend/models/Song.js (exact casing)
} catch (e) {
  console.warn('Warning: Song model not found. Server will use in-memory songs array. Create backend/models/Song.js to enable DB persistence.');
}

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

/* ---------- Default songs (used for initial DB seed or fallback) ---------- */
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

/* ---------- Helper: seed DB with default songs if collection empty ---------- */
async function seedDefaultSongsIfNeeded() {
  if (!Song) return; // no DB model available
  try {
    const count = await Song.countDocuments();
    if (count === 0) {
      console.log('No songs in DB — seeding default songs...');
      const docs = songs.map(s => ({
        title: s.title,
        artist: s.artist,
        cover: s.cover,
        url: s.url,
        uploadedAt: new Date()
      }));
      await Song.insertMany(docs);
      console.log('Seeded default songs into DB.');
    } else {
      console.log(`Songs in DB: ${count}`);
    }
  } catch (err) {
    console.warn('Failed to seed songs:', err.message);
  }
}

/* If DB is connected, try seeding after a short delay (to let mongoose finish connecting) */
mongoose.connection.once('open', () => {
  seedDefaultSongsIfNeeded().catch(() => {});
});

/* ---------- API Endpoints ---------- */

/**
 * GET /api/songs
 * - If DB model exists, read from DB (most recent first)
 * - Otherwise return in-memory songs array
 */
app.get('/api/songs', async (req, res) => {
  try {
    if (Song) {
      const dbSongs = await Song.find().sort({ uploadedAt: -1 }).lean();
      return res.json(dbSongs);
    }
    return res.json(songs);
  } catch (err) {
    console.error('Fetch songs error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/upload
 * - multipart form: fields: title, artist, files: song, cover
 * - stores files to /uploads and saves a Song doc (if model available) or pushes to memory
 */
app.post('/api/upload', upload.fields([{ name: 'song' }, { name: 'cover' }]), async (req, res) => {
  try {
    const songFile = req.files && req.files['song'] && req.files['song'][0];
    const coverFile = req.files && req.files['cover'] && req.files['cover'][0];
    const { title, artist } = req.body;

    if (!songFile || !coverFile || !title || !artist) {
      return res.status(400).json({ success: false, message: 'song, cover, title and artist are required' });
    }

    const newSongData = {
      title,
      artist,
      cover: `/uploads/${coverFile.filename}`,
      url: `/uploads/${songFile.filename}`,
      uploadedAt: new Date()
    };

    if (Song) {
      const doc = new Song(newSongData);
      await doc.save();
      return res.json({ success: true, song: doc });
    } else {
      songs.push(newSongData);
      return res.json({ success: true, song: newSongData });
    }
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/songs/add
 * - Add a song by JSON (for remote URLs)
 * - body: { title, artist, url, cover }
 */
app.post('/api/songs/add', async (req, res) => {
  try {
    const { title, artist, url, cover } = req.body;
    if (!title || !artist || !url) {
      return res.status(400).json({ success: false, message: 'title, artist and url are required' });
    }

    const newSongData = {
      title,
      artist,
      url: url.startsWith('http') ? url : `/uploads/${url}`,
      cover: cover ? (cover.startsWith('http') ? cover : `/uploads/${cover}`) : null,
      uploadedAt: new Date()
    };

    if (Song) {
      const doc = new Song(newSongData);
      await doc.save();
      return res.json({ success: true, song: doc });
    } else {
      songs.push(newSongData);
      return res.json({ success: true, song: newSongData });
    }
  } catch (err) {
    console.error('Add song error:', err);
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
