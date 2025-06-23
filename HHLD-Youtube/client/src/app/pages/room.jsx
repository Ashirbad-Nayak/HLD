'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const Room = () => {
  const [userStream, setUserStream] = useState(null);
  const [showLive, setShowLive] = useState(false);

  const streamUser = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            })
            setUserStream(stream);
        }

  const toggleView = () => {setShowLive(prev => !prev); }
  useEffect(() => {
    if (showLive) {
      streamUser();
    }
  }, [showLive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-300 mb-10 drop-shadow-sm">
        🎥 HHLD Video Room
      </h1>

      {/* Toggle Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={toggleView}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-purple-800 font-semibold rounded-xl text-md px-6 py-3 transition-all shadow-lg"
        >
          {showLive ? '🎬 Show Uploaded Video' : '🔴 Go Live'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {!showLive ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-purple-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
              📺 Pre-recorded AWS Stream
            </h2>
            <ReactPlayer
              url="Any Youtube Url"//"hany s3 url"
              controls
              width="100%"
              height="600px"
              className="rounded-xl overflow-hidden"
            />
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-purple-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
              🔴 Live Stream (Your Camera)
            </h2>
            <ReactPlayer
              url={userStream}
              controls
              width="100%"
              height="600px"
              className="rounded-xl overflow-hidden"
              playing
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
