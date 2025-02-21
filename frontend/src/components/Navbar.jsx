import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        {/* Navbar */}
        <nav className="w-full bg-gray-900 p-6 fixed top-0 left-0 right-0 z-10 shadow-xl rounded-b-lg">
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    <Link to="/" className="text-white text-3xl font-semibold tracking-wide hover:text-pink-300 transition-all hidden sm:block">
      Flashcard Master
    </Link>
    <div className="space-x-6 flex justify-between items-center w-full sm:w-auto">
      <Link
        to="/login"
        className="text-white bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 py-2 px-6 rounded-lg hover:scale-105 transform transition-all font-semibold text-lg"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="text-white bg-gradient-to-r from-pink-500 via-red-600 to-yellow-600 py-2 px-6 rounded-lg hover:scale-105 transform transition-all font-semibold text-lg"
      >
        Sign Up
      </Link>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
