const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Fetch available video formats
app.post('/video/formats', async (req, res) => {
  const { url } = req.body;
  
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send('Invalid URL.');
  }
  
  try {
    const info = await ytdl.getInfo(url);
    res.json(info.formats);
  } catch (error) {
    res.status(500).send('Failed to fetch video formats.');
  }
});

// Download video
app.get('/video/download', async (req, res) => {
  const { url, format } = req.query;
  
  if (!url || !format || !ytdl.validateURL(url)) {
    return res.status(400).send('Invalid parameters.');
  }
  
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, {
    format: format,
  }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
