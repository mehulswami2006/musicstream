const express = require('express');
const multer = require('multer');
const Song = require('../models/Song');


const storage = multer.diskStorage({
destination: function (req, file, cb) { cb(null, 'uploads/') },
filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname) }
});
const upload = multer({ storage });


const router = express.Router();


router.post('/', upload.single('song'), async (req, res) => {
try {
const { title, artist, tags, userId } = req.body;
const song = new Song({
title,
artist,
filename: req.file.filename,
uploadedBy: userId,
tags: tags ? tags.split(',') : []
});
await song.save();
res.json(song);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


module.exports = router;