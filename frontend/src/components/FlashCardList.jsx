import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";

const FlashcardList = () => {
  const email = localStorage.getItem("email");
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState(null);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);

  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewingCount, setReviewingCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flashcards/all");
        let allFlashcards = response.data;

        const today = new Date().toISOString().split("T")[0];
        const mastered = allFlashcards.filter((card) => card.level === 5);
        const reviewing = allFlashcards.filter(
          (card) => new Date(card.nextReviewDate).toISOString().split("T")[0] <= today
        );
        const learning = allFlashcards.filter((card) => card.level < 5);

        setMasteredCount(mastered.length);
        setReviewingCount(reviewing.length);
        setLearningCount(learning.length);

        const dueFlashcards = reviewing.sort((a, b) => a.level - b.level);
        setFlashcards(dueFlashcards);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFlashcards();
  }, []);

  const calculateNextReviewDate = (level) => {
    const reviewDays = [1, 3, 7, 14, 30]; 
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + reviewDays[level - 1]);
    return nextDate;
  };

  const handleAnswer = async (flashcardId, correct) => {
    let updatedFlashcards = [...flashcards];
    let flashcard = updatedFlashcards[currentCardIndex];

    if (correct) {
      flashcard.level = Math.min(flashcard.level + 1, 5); 
      setKnownCount((prev) => prev + 1); 
    } else {
      flashcard.level = 1; 
      setDontKnowCount((prev) => prev + 1); 
    }

    flashcard.nextReviewDate = calculateNextReviewDate(flashcard.level);

    try {
      await axios.put(`http://localhost:5000/api/flashcards/update/${flashcardId}`, {
        level: flashcard.level,
        nextReviewDate: flashcard.nextReviewDate,
      });

      updatedFlashcards.splice(currentCardIndex, 1);
      setFlashcards(updatedFlashcards);

      if (currentCardIndex >= updatedFlashcards.length) {
        setCurrentCardIndex(0); 
      }

      setAttemptedCount((prev) => prev + 1);

      const today = new Date().toISOString().split("T")[0];
      const mastered = updatedFlashcards.filter((card) => card.level === 5);
      const reviewing = updatedFlashcards.filter(
        (card) => new Date(card.nextReviewDate).toISOString().split("T")[0] <= today
      );
      const learning = updatedFlashcards.filter((card) => card.level < 5);

      setMasteredCount(mastered.length);
      setReviewingCount(reviewing.length);
      setLearningCount(learning.length);
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

  const handleCardClick = (cardId) => {
    if (flippedCard === cardId) return;
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  const totalFlashcards = reviewingCount;
  const attemptedPercentage = totalFlashcards === 0 ? 0 : (attemptedCount / totalFlashcards) * 100;
  const knownPercentage = totalFlashcards === 0 ? 0 : (knownCount / totalFlashcards) * 100;
  const dontKnowPercentage = totalFlashcards === 0 ? 0 : (dontKnowCount / totalFlashcards) * 100;

  return (
    <div className=" min-h-screen font-sans text-white">
      {/* Navbar */}
      <nav className="w-full bg-gray-900 p-6 fixed top-0 left-0 right-0 z-10 shadow-xl rounded-b-lg">
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    <Link to="/" className="text-white text-3xl font-semibold tracking-wide hover:text-pink-300 transition-all">
      Flashcard Master
    </Link>
    <div className="space-x-6">
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


      <div className="mt-32 text-center">
        <h1 className="text-5xl font-extrabold mb-8">Your Flashcards</h1>

        {email === "animeshp1607@gmail.com" && (
          <div className="mb-12">
            <Link to="/add" className="text-xl text-pink-400 hover:text-pink-500 transition-all">
              Add a new card
            </Link>
            <span className="mx-4 text-white">|</span>
            <Link to="/delete" className="text-xl text-pink-400 hover:text-pink-500 transition-all">
              Edit your flashcards
            </Link>
          </div>
        )}
      </div>

      {/* Flashcards */} 
<div className="flex justify-center items-center px-4 py-12">
  {flashcards.length > 0 ? (
    <div
      key={flashcards[currentCardIndex]._id}
      className="w-[350px] md:w-[450px] lg:w-[550px] p-8 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500"
      onClick={() => handleCardClick(flashcards[currentCardIndex]._id)}
    >
      {flippedCard === flashcards[currentCardIndex]._id ? (
        <div className="flex flex-col items-center justify-center text-center text-white">
          <p className="text-lg md:text-xl font-semibold mb-6">{flashcards[currentCardIndex].answer}</p>
          <div className="flex gap-6 justify-center w-full">
            <button
              onClick={() => handleAnswer(flashcards[currentCardIndex]._id, true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              I know it
            </button>
            <button
              onClick={() => handleAnswer(flashcards[currentCardIndex]._id, false)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              I don't know it
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-[250px] flex flex-col items-center justify-center text-center text-white">
          <p className="text-2xl md:text-3xl font-semibold mb-4">{flashcards[currentCardIndex].question}</p>
          <div className="absolute bottom-0 p-4 w-full bg-black bg-opacity-50 text-lg text-center">Click to see Answer</div>
        </div>
      )}
    </div>
  ) : (
    <p className="text-2xl font-semibold text-gray-300">No flashcards due for review</p>
  )}
</div>


      {/* Progress Bars */}
      <div className="px-8 py-12 bg-gray-800 rounded-xl mx-auto mb-16 max-w-5xl">
        <p className="text-2xl font-semibold text-white mb-4">Today's Due Flashcards: {totalFlashcards}</p>
        
        <div className="mb-6">
          <p className="text-lg">Attempted: {attemptedCount} out of {totalFlashcards}</p>
          <div className="w-full bg-gray-600 h-4 rounded-lg mb-4">
            <div className="bg-blue-600 h-full" style={{ width: `${attemptedPercentage}%` }}></div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg">Known: {knownCount} out of {totalFlashcards}</p>
          <div className="w-full bg-gray-600 h-4 rounded-lg mb-4">
            <div className="bg-green-600 h-full" style={{ width: `${knownPercentage}%` }}></div>
          </div>
        </div>

        <div>
          <p className="text-lg">Don't Know: {dontKnowCount} out of {totalFlashcards}</p>
          <div className="w-full bg-gray-600 h-4 rounded-lg">
            <div className="bg-red-600 h-full" style={{ width: `${dontKnowPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;
