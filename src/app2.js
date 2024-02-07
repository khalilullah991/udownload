import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this is pointing to the correct path of your CSS file

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle the loading animation

  const fetchVideoInfo = async () => {
    try {
      setLoading(true); // Start the loading animation
      const response = await axios.get(`http://localhost:5000/videoInfo?videoUrl=${encodeURIComponent(url)}`);
      setFormats(response.data);
    } catch (error) {
      console.error('Error fetching video information:', error);
      // Handle error, e.g., display notification to the user
    } finally {
      setLoading(false); // Stop the loading animation regardless of outcome
    }
  };

  const handleDownload = (itag) => {
    window.location.href = `http://localhost:5000/download?videoUrl=${encodeURIComponent(url)}&itag=${itag}`;
  };

  return (
    <div id='root'>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button className='b1' onClick={fetchVideoInfo}>Fetch Available Formats</button>

      {/* Display loading animation */}
      {loading && (
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      )}

      {formats.length > 0 && (
        <div>
          <h3>Select a format to download:</h3>
          <ul>
            {formats.map((format, index) => (
              <li key={index}>
                {format.quality} - {format.container}
                <button className='b2' onClick={() => handleDownload(format.itag)}>Download</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoDownloader;