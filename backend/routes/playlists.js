// backend/routes/playlists.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Playlist = require('../models/Playlist.js'); // exact casing
const auth = require('../middleware/auth.js');

/**
 * POST /api/playlists
 * Create a playlist (protected)
 * body: { name, public } 
 */
router.post('/', auth, [
  body('name').isLength({ min: 1 }).withMessage('Name required'),
  body('public').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const pl = new Playlist({
      name: req.body.name,
      owner: req.user.userId,
      public: !!req.body.public,
      songs: []
    });
    await pl.save();
    return res.json(pl);
  } catch (err) {
    console.error('Create playlist error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/playlists/:id/song
 * Add a song to a playlist (owner only)
 * body: { url, title, artist, cover }
 */
router.post('/:id/song', auth, [
  body('url').isURL().withMessage('Valid song URL required'),
  body('title').optional().isString(),
  body('artist').optional().isString(),
  body('cover').optional().isURL()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ message: 'Playlist not found' });
    if (pl.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    pl.songs.push({
      url: req.body.url,
      title: req.body.title || 'Unknown',
      artist: req.body.artist || 'Unknown',
      cover: req.body.cover || undefined
    });
    await pl.save();
    return res.json(pl);
  } catch (err) {
    console.error('Add song error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/playlists/:id/visibility
 * Change visibility (owner only)
 * body: { public: true|false }
 */
router.put('/:id/visibility', auth, [
  body('public').isBoolean().withMessage('public must be boolean')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ message: 'Playlist not found' });
    if (pl.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    pl.public = req.body.public;
    await pl.save();
    return res.json(pl);
  } catch (err) {
    console.error('Visibility update error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/playlists/mine
 * List current user's playlists (protected)
 */
router.get('/mine', auth, async (req, res) => {
  try {
    const pls = await Playlist.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    return res.json(pls);
  } catch (err) {
    console.error('List mine error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/playlists/public
 * List public playlists (anyone)
 */
router.get('/public', async (req, res) => {
  try {
    const pls = await Playlist.find({ public: true }).populate('owner', 'name').sort({ createdAt: -1 });
    return res.json(pls);
  } catch (err) {
    console.error('List public error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/playlists/:id
 * Get a playlist, respect privacy:
 * - if public, anyone can fetch
 * - if private, only owner (protected)
 */
router.get('/:id', async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id).populate('owner', 'name');
    if (!pl) return res.status(404).json({ message: 'Playlist not found' });

    if (pl.public) return res.json(pl);

    // private -> require token and owner match
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Private playlist - authorization required' });

    // verify token lazily here to avoid double-mounting middleware
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (pl.owner._id.toString() !== decoded.userId) return res.status(403).json({ message: 'Forbidden' });
      return res.json(pl);
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Get playlist error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/playlists/:id
 * Delete playlist (owner only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ message: 'Playlist not found' });
    if (pl.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    await pl.remove();
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete playlist error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
