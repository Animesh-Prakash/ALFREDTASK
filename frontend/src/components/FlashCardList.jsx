import React, { useState, useEffect, use } from "react";  
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const FlashcardList = () => {
  const email = localStorage.getItem("email");
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState(null);
  const [attemptedCount, setAttemptedCount] = useState(parseInt(localStorage.getItem("attemptedCount")) || 0);
  const [knownCount, setKnownCount] = useState(parseInt(localStorage.getItem("knownCount")) || 0);
  const [dontKnowCount, setDontKnowCount] = useState(parseInt(localStorage.getItem("dontKnowCount")) || 0);
  const [totalCard, setTotalCard] = useState(0);
  const [initialTotalCard, setInitialTotalCard] = useState(
    parseInt(localStorage.getItem("initialTotalCard")) || 0
  ); // Get from localStorage

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
  
    
        setFlashcards(reviewing);
        setTotalCard(reviewing.length);

        // If initialTotalCard is not already set, store it in localStorage
        if (!localStorage.getItem("initialTotalCard")) {
          localStorage.setItem("initialTotalCard", reviewing.length);
          setInitialTotalCard(reviewing.length);
        }

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
      setKnownCount((prev) => {
        localStorage.setItem("knownCount", prev + 1);
        return prev + 1;
      });
    } else {
      flashcard.level = 1;
      setDontKnowCount((prev) => {
        localStorage.setItem("dontKnowCount", prev + 1);
        return prev + 1;
      });
    }
  
    flashcard.nextReviewDate = calculateNextReviewDate(flashcard.level);
  
    try {
      await axios.put(`http://localhost:5000/api/flashcards/update/${flashcardId}`, {
        level: flashcard.level,
        nextReviewDate: flashcard.nextReviewDate,
      });
  
      setAttemptedCount((prev) => {
        localStorage.setItem("attemptedCount", prev + 1);
        return prev + 1;
      });
  
      updatedFlashcards.splice(currentCardIndex, 1);
      setFlashcards(updatedFlashcards);
      setTotalCard(updatedFlashcards.length);
  
      if (updatedFlashcards.length === 0) {
        setCurrentCardIndex(0);
      } else {
        setCurrentCardIndex((prevIndex) => prevIndex % updatedFlashcards.length);
      }
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

  const handleCardClick = (cardId) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  const totalFlashcards = initialTotalCard; 
  const attemptedPercentage = totalFlashcards === 0 ? 0 : (attemptedCount / totalFlashcards) * 100;
  const knownPercentage = totalFlashcards === 0 ? 0 : (knownCount / totalFlashcards) * 100;
  const dontKnowPercentage = totalFlashcards === 0 ? 0 : (dontKnowCount / totalFlashcards) * 100;

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-white">
        <div className="mt-32 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8">Your Flashcards</h1>
          {email === "animeshp1607@gmail.com" && (
            <div className="mb-5 sm:mb-12 flex justify-center items-center gap-5 sm:space-x-6 flex-wrap sm:flex-nowrap">
              <Link
                to="/add"
                className="text-xl text-white bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Add a new card
              </Link>
              <Link
                to="/delete"
                className="text-xl text-white bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
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
              className="relative w-[350px] md:w-[450px] lg:w-[550px] h-[300px] rounded-2xl shadow-2xl cursor-pointer transition-transform duration-500 transform perspective-1000"
              onClick={() => handleCardClick(flashcards[currentCardIndex]._id)}
            >
              <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${flippedCard === flashcards[currentCardIndex]._id ? "rotate-y-180" : ""}`}>
                {/* Front Side */}
                <div className="absolute w-full h-full flex flex-col items-center justify-center text-center px-6 bg-purple-800 text-white rounded-2xl backface-hidden">
                  <p className="text-2xl md:text-3xl font-semibold">
                    {flashcards[currentCardIndex].question}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full py-3 bg-yellow-400 text-gray-900 font-semibold text-lg text-center rounded-b-2xl">
                    Click to see Answer
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full flex flex-col items-center justify-center text-center px-6 bg-yellow-400 text-gray-900 rounded-2xl rotate-y-180 backface-hidden">
                  <p className="text-lg md:text-4xl font-semibold">
                    {flashcards[currentCardIndex].answer}
                  </p>
                  <div className="flex gap-6 mt-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnswer(flashcards[currentCardIndex]._id, true); }}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                    >
                      I know it
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnswer(flashcards[currentCardIndex]._id, false); }}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                    >
                      I don't know it
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-2xl font-semibold text-gray-300 my-16">No flashcards due for review</p>
          )}
        </div>

        {/* Progress Bars */}
        <div className="px-8 py-12 bg-gray-800 rounded-xl mx-3 sm:mx-auto mb-16 max-w-5xl">
  <p className="text-2xl font-semibold text-white mb-4">Today's Due Flashcards: {initialTotalCard}</p>

  <div className="mb-6">
    <p className="text-lg">Attempted: {attemptedCount} out of {totalFlashcards}</p>
    <div className="w-full bg-gray-600 h-4 rounded-lg mb-4">
      <div
        className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${attemptedPercentage}%` }}
      ></div>
    </div>
  </div>

  <div className="mb-6">
    <p className="text-lg">Known: {knownCount} out of {totalFlashcards}</p>
    <div className="w-full bg-gray-600 h-4 rounded-lg mb-4">
      <div
        className="bg-green-600 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${knownPercentage}%` }}
      ></div>
    </div>
  </div>

  <div>
    <p className="text-lg">Don't Know: {dontKnowCount} out of {totalFlashcards}</p>
    <div className="w-full bg-gray-600 h-4 rounded-lg">
      <div
        className="bg-red-600 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${dontKnowPercentage}%` }}
      ></div>
    </div>
  </div>
</div>

      </div>
    </>
  );
};

export default FlashcardList;
