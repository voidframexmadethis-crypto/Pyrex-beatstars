import express, { Router } from 'express';
import mongoose from 'mongoose';

// Define robust schemas for beats
const LicenseTierSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "MP3 Lease", "WAV Lease", "Unlimited / Exclusive"
  price: { type: Number, required: true },
  features: [String],
  fileType: { type: String, enum: ['mp3', 'wav', 'stems', 'exclusive'] }
});

const BeatSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  genre: { type: String, required: true },
  bpm: { type: Number, required: true },
  key: { type: String, required: true },
  tags: [String],
  coverArtUrl: { type: String, required: true },
  audioFileUrl: { type: String, required: true }, // Untagged/Tagged audio link or Base64 data string
  trackedOutStemsUrl: { type: String }, // Optional stems download link
  licenses: [LicenseTierSchema],
  playsCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Beat = mongoose.model('Beat', BeatSchema);

export const createBeatRouter = (): Router => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const beats = await Beat.find();
      res.json(beats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const newBeat = new Beat(req.body);
      await newBeat.save();
      res.status(201).json(newBeat);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
