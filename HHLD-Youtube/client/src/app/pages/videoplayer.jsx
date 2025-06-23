"use client";
import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  const src = "master m3u8 url from s3"; // Replace with your HLS stream URL

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReadyToPlay(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      setIsReadyToPlay(true);
    }
  }, [src]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => {
        console.warn('Autoplay prevented:', err);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 px-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">

      {/* App Name Header */}
      <header className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight">
          YouTube
        </h1>
        <p className="text-purple-500 dark:text-purple-200 mt-2 text-lg">
          Adaptive HLS Video Streaming
        </p>
      </header>

      {/* Video Player */}
      <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          controls
          className="w-full rounded-xl"
          muted // Needed to allow autoplay in some cases
        />
      </div>

      {/* Play Button */}
      {isReadyToPlay && (
        <button
          onClick={handlePlay}
          className="mt-6 px-6 py-2 bg-gradient-to-br from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
        >
          ▶️ Play
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
