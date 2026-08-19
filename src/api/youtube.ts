import { Router } from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import fs from 'fs';

export function createYoutubeRouter() {
  const router = Router();
  const upload = multer({ dest: '/tmp/youtube_uploads/' });

  router.post('/api/upload-to-youtube', upload.single('video'), async (req, res) => {
    try {
      const { title, description, token } = req.body;
      const file = req.file;

      if (!token) {
        return res.status(401).json({ error: 'Missing YouTube access token' });
      }
      if (!file) {
        return res.status(400).json({ error: 'Missing video file' });
      }

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: token });

      const youtube = google.youtube({ version: 'v3', auth });

      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title || 'New Beat #Shorts',
            description: description || 'Listen to my new beat!',
            tags: ['beats', 'typebeat', 'Shorts'],
            categoryId: '10', // Music
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          body: fs.createReadStream(file.path),
        },
      });

      // Cleanup temp file
      fs.unlinkSync(file.path);

      res.json({ success: true, videoId: response.data.id });
    } catch (error: any) {
      console.error('YouTube upload error:', error);
      res.status(500).json({ error: error.message || 'Failed to upload to YouTube' });
    }
  });

  return router;
}
