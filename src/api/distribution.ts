import express, { Router } from 'express';
import { dispatchGlobalRelease } from '../lib/distributionUtils';

export const createDistributionRouter = (): Router => {
  const router = express.Router();

  router.post('/api/distribution/dispatch', async (req, res) => {
    try {
      const { trackTitle, artistInfo, dspPlatforms } = req.body;

      if (!trackTitle || !artistInfo) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Parsing artist info (assuming "Name <email>") - simple parsing
      const nameMatch = artistInfo.match(/^(.*?)(?:\s*<|$)/);
      const emailMatch = artistInfo.match(/<(.*?)>/);
      
      const artistName = nameMatch ? nameMatch[1].trim() : artistInfo;
      const artistEmail = emailMatch ? emailMatch[1].trim() : 'artist@krypside.com'; // fallback

      await dispatchGlobalRelease({
        artistName,
        artistEmail,
        trackTitle,
        isrcCode: `KRYP-${Date.now()}`,
        dspPlatforms: dspPlatforms || ['Spotify', 'Apple Music', 'Tidal']
      });

      res.status(200).json({ success: true, message: "Dispatched to global networks." });
    } catch (error: any) {
      console.error("Distribution error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
