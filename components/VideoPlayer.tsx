import React, { useRef, useState } from 'react';
import HLS from 'hls.js';

const VideoPlayer = ({ title, videoUrl, metadata }) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize HLS and attach it to video element
  React.useEffect(() => {
    let hls;
    if (HLS.isSupported()) {
      hls = new HLS();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(HLS.Events.MANIFEST_PARSED, function () {
        videoRef.current.play();
      });
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="video-player">
      <h1>{title}</h1>
      <video ref={videoRef} controls style={{ width: '100%' }}></video>
      <div className="metadata">
        <p>{metadata}</p>
      </div>
      <button onClick={toggleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}</button>
    </div>
  );
};

export default VideoPlayer;