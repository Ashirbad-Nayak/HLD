
"use client"
import React, { useEffect, useState } from 'react';
import axios from "axios"
import dynamic from 'next/dynamic'
import { useVideosStore } from '../zustand/useVideosStore'
import NavBar from '../components/navbar.jsx';
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const YouTubeHome = () => {
   const [videos, setVideos] = useState([]);
   const [loading, setLoading] = useState(true);
   const { searchedVideos } = useVideosStore();
   useEffect(() => {

       const getVideos = async () => {
           try {
               const res = await axios.get('http://localhost:8082/watch/home');
               console.log(res);
               setVideos(res.data);
               setLoading(false); // Set loading to false when videos are fetched
           } catch (error) {
               console.log('Error in fetching videos : ', error);
               setLoading(false);
           }
       }
       getVideos();

   }, []);

   return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">

    {/* Decorative blurred blobs */}
    <div className="absolute top-[-150px] left-[-100px] w-[300px] h-[300px] bg-purple-300 dark:bg-purple-800 rounded-full filter blur-3xl opacity-30 animate-pulse z-0"></div>
    <div className="absolute bottom-[-100px] right-[-120px] w-[350px] h-[350px] bg-pink-300 dark:bg-pink-700 rounded-full filter blur-2xl opacity-30 animate-pulse z-0"></div>
  
    {/* Navbar */}
    <div className="relative z-10">
      <NavBar />
    </div>
  
    {/* Main Content */}
    <div className="relative z-10">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
            Loading...
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-16 py-10 space-y-16">
        {/* Searched Videos */}
        {searchedVideos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchedVideos.map(video => (
                <div
                  key={video.id + '1'}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="aspect-video">
                    <ReactPlayer
                      url={video._source.videoUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                      style={{ borderRadius: '0.5rem' }}
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate">
                      {video._source.title}
                    </h2>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Author - {video._source.author}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                      {video._source.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
        {/* Default Videos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
            All Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="aspect-video">
                  <ReactPlayer
                    url={video.url}
                    width="100%"
                    height="100%"
                    controls={true}
                    style={{ borderRadius: '0.5rem' }}
                  />
                </div>
                <div className="p-5 space-y-1">
                  <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate">
                    {video.title}
                  </h2>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Author - {video.author}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      
      )}
    </div>
  </div>
  
   );
};

export default YouTubeHome;