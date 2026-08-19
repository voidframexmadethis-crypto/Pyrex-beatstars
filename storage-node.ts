import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const STORAGE_DIR = path.join(__dirname, 'vault');

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const upload = multer({ dest: STORAGE_DIR });

app.post('/internal/store', upload.single('audioFile'), (req, res) => {
  const nodeSecret = req.headers['x-node-secret'];
  // In a real multi-node setup, this secret should be verified against
  // the specific node's expected secret.
  if (nodeSecret !== 'server_secret_key_1' && nodeSecret !== 'server_secret_key_2') {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!req.file) return res.status(400).json({ error: 'Missing file' });

  res.json({
    success: true,
    fileKey: req.file.filename,
    path: req.file.path
  });
});

app.listen(5001, () => {
  console.log('Krypside Storage Node vault active on port 5001');
});
