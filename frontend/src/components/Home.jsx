import React, { useState } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/flashcards'); // Redirect to flashcard page if authenticated
    } else {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-40 flex flex-col items-center justify-center text-center px-5">
        {/* Hero Section */}
        <div className="max-w-4xl text-white">
          <h1 className="sm:text-5xl text-4xl font-extrabold drop-shadow-lg">
            Boost Your Learning with <span className="text-yellow-300">Interactive Flashcards</span>
          </h1>
          <p className="mt-6 text-lg opacity-90">
            Struggling to memorize concepts? Our flashcards make studying <b>efficient, fun, and engaging!</b> Whether you're preparing for exams, coding interviews, or just expanding your knowledge, our interactive flashcards help you retain information faster.
          </p>
          <button
            onClick={handleGetStartedClick} 
            className="mt-6 px-6 py-3 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
          >
            Get Started 🚀
          </button>
        </div>

        {/* Features Section */}
        <div className="my-16 w-[90%] mx-auto">
          <div className="p-6 backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-xl text-white">
            <h2 className="text-lg sm:text-3xl font-semibold text-yellow-300">Why Use Our Flashcards?</h2>
            <ul className="mt-4 space-y-3 opacity-90 flex justify-start flex-col ">
              <li>✅ <b>Smart Review Mode</b> – Reinforce learning with spaced repetition.</li>
              <li>✅ <b>Collaborate & Share</b> – Study with friends or explore public decks.</li>
              <li>✅ <b>Quick & Simple</b> – Swipe, flip, and test yourself in seconds!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
