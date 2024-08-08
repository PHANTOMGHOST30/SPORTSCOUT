const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const videoAnalysis = require('./videoAnalysis');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sportscout', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the player schema
const playerSchema = new mongoose.Schema({
  name: String,
  contactInfo: String,
  address: String,
  profilePicture: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
});

// Define the video schema
const videoSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  videoUrl: String,
  rating: { type: Number, default: 0 }
});

// Create models
const Player = mongoose.model('Player', playerSchema);
const Video = mongoose.model('Video', videoSchema);

// Upload video endpoint
app.post('/uploadVideo', multer({ dest: './uploads/' }).single('video'), async (req, res) => {
  const video = new Video({ playerId: req.body.playerId, videoUrl: req.file.path });
  await video.save();
  res.json({ message: 'Video uploaded successfully' });
});

// Analyze video endpoint
app.post('/analyzeVideo', async (req, res) => {
  const videoId = req.body.videoId;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }
  const rating = await videoAnalysis.analyzeVideo(video.videoUrl);
  video.rating = rating;
  await video.save();
  res.json({ message: `Video analyzed with rating ${rating}` });
});

// Get player profile endpoint
app.get('/player/:id', async (req, res) => {
  const playerId = req.params.id;
  const player = await Player.findById(playerId).populate('videos');
  if (!player) {
    return res.status(404).json({ message: 'Player not found' });
  }
  res.json(player);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});