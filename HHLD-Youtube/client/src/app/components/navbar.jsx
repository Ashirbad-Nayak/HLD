"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import SearchBar from './searchbar.jsx'

const NavBar = () => {
   const router = useRouter()
   const { data } = useSession()
   console.log('data---------- ', data);

   const goToUpload = () => {
       router.push('/upload')
   }
   return (
       <div>
          
           <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 shadow-sm">
  <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <span className="text-2xl font-bold text-gray-800 dark:text-white">YouTube</span>

    {/* Search Bar */}
    <div className="flex-1 mx-4 hidden sm:block">
      <SearchBar />
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">
      {data ? (
        <>
          <button
            onClick={goToUpload}
            className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            Upload
          </button>
          <button
            onClick={signOut}
            className="bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            Sign Out
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hello, {data.user.name}
            </span>
            <img
              className="w-10 h-10 rounded-full border-2 border-blue-500"
              src={data.user.image}
              alt="User Avatar"
            />
          </div>
        </>
      ) : (
        <button
          onClick={signIn}
          className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          Sign In
        </button>
      )}
    </div>
  </div>

  {/* Mobile Search */}
  <div className="px-4 pb-3 sm:hidden">
    <SearchBar />
  </div>
</nav>



       </div>
   )
}

export default NavBar