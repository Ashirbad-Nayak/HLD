
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from "next/navigation";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data) redirect("/");
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setAuthor('');
  };

  const handleUpload = async () => {
    try {
      if (!title || !author || !selectedFile) {
        alert('All fields including file are required.');
        return;
      }

      const formData = new FormData();
      formData.append('filename', selectedFile.name);

      const initializeRes = await axios.post('http://localhost:8080/upload/initialize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { uploadId } = initializeRes.data;
      const chunkSize = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      const uploadPromises = [];

      let start = 0;
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;

        const chunkFormData = new FormData();
        chunkFormData.append('filename', selectedFile.name);
        chunkFormData.append('chunk', chunk);
        chunkFormData.append('totalChunks', totalChunks);
        chunkFormData.append('chunkIndex', chunkIndex);
        chunkFormData.append('uploadId', uploadId);

        uploadPromises.push(
          axios.post('http://localhost:8080/upload', chunkFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      await Promise.all(uploadPromises);

      await axios.post('http://localhost:8080/upload/complete', {
        filename: selectedFile.name,
        totalChunks,
        uploadId,
        title,
        description,
        author
      });

      showSuccessToast('✅ Video uploaded successfully!');
      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
      showSuccessToast('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  {/* App Name */}
  <h1 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-300 mb-8 drop-shadow-sm">
    🎬 YouTube Uploader
  </h1>

  <div className="flex items-center justify-center">
    <div className="w-full max-w-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-purple-200 dark:border-gray-700">
      {/* Toast + Form goes here */}
    

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg animate-fade-in-out">
            {toastMessage}
          </div>
        </div>
      )}
  
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 tracking-tight">
        📤 Upload Your Video
      </h2>
  
      <form encType="multipart/form-data" className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
  
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
        />
  
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
         
  
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            ← Back to Home
          </button>

          <button
            type="button"
            onClick={handleUpload}
            className="w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            🚀 Upload
          </button>
        </div>
      </form>
      </div>
  </div>
</div>
  
  );
};


export default UploadForm;