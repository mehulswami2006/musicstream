// backend/models/Playlist.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SongSchema = new Schema({
  title: { type: String, trim: true },
  artist: { type: String, trim: true },
  url: { type: String, required: true },
  cover: { type: String },
  source: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const PlaylistSchema = new Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  public: { type: Boolean, default: false },
  songs: { type: [SongSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
