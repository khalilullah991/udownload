import React, { useState } from 'react';
import axios from 'axios';

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [error, setError] = useState('');

  const fetchFormats = async () => {
    try {
      // Basic input validation
      if (!url.trim()) {
        setError('Please enter a valid video URL.');
        return;
      }

      const response = await axios.post('http://localhost:3001/video/formats', { url });
      setFormats(response.data);
      setError('');
    } catch (error) {
      // Handle server errors
      setError('Failed to fetch formats. Please try again later.');
    }
  };

  const downloadVideo = () => {
    if (!selectedFormat) {
      setError('Please select a format.');
      return;
    }
    // Use encodeURIComponent to sanitize URL parameter
    window.open(`http://localhost:3001/video/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`);
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter video URL"
      />
      <button onClick={fetchFormats}>Fetch Formats</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {formats.length > 0 && (
        <select onChange={(e) => setSelectedFormat(e.target.value)}>
          <option value="">Select Format</option>
          {formats.map((format, index) => (
            <option key={index} value={format.itag}>
              {format.container} - {format.qualityLabel}
            </option>
          ))}
        </select>
      )}
      <button onClick={downloadVideo}>Download</button>
    </div>
  );
};

export default VideoDownloader;
