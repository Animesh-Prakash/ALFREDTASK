import React, { useState, useEffect } from "react"; 
import axios from "axios";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState(null);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [knownCount, setKnownCount] = useState(0);

  // States to track categorized flashcards
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewingCount, setReviewingCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flashcards/all");
        let allFlashcards = response.data;

        // Categorize flashcards
        const today = new Date().toISOString().split('T')[0];
        const mastered = allFlashcards.filter(card => card.level === 5);
        const reviewing = allFlashcards.filter(card => new Date(card.nextReviewDate).toISOString().split('T')[0] <= today);
        const learning = allFlashcards.filter(card => card.level < 5);

        // Set categorized counts
        setMasteredCount(mastered.length);
        setReviewingCount(reviewing.length);
        setLearningCount(learning.length);

        // Filter and sort the flashcards to show only those due today
        const dueFlashcards = reviewing.sort((a, b) => a.level - b.level);
        setFlashcards(dueFlashcards);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFlashcards();

    // Initialize socket connection
    const socketInstance = io(); // Connect to the server
    setSocket(socketInstance);

    socketInstance.on('message', (message) => {
      console.log('Received message from server:', message);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Function to calculate next review date based on the level
  const calculateNextReviewDate = (level) => {
    const reviewDays = [1, 3, 7, 14, 30]; // Review intervals per level
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + reviewDays[level - 1]);
    return nextDate;
  };

  // Function to handle correct or incorrect answers
  const handleAnswer = async (flashcardId, correct) => {
    if (!socket) return;

    let updatedFlashcards = [...flashcards];
    let flashcard = updatedFlashcards[currentCardIndex];

    if (correct) {
      flashcard.level = Math.min(flashcard.level + 1, 5); // Increase level (max 5)
      setKnownCount(prev => prev + 1); // Count as known
    } else {
      flashcard.level = 1; // Reset to level 1 if incorrect
    }

    // Update review date based on the new level
    flashcard.nextReviewDate = calculateNextReviewDate(flashcard.level);

    // Send update to the backend
    try {
      await axios.put(`http://localhost:5000/api/flashcards/update/${flashcardId}`, {
        level: flashcard.level,
        nextReviewDate: flashcard.nextReviewDate
      });

      // Remove reviewed flashcard and move to next
      updatedFlashcards.splice(currentCardIndex, 1);
      setFlashcards(updatedFlashcards);

      if (currentCardIndex >= updatedFlashcards.length) {
        setCurrentCardIndex(0); // Reset index if out of range
      }

      // Update attempted count
      setAttemptedCount(prev => prev + 1);

      // Update counts after answer is submitted
      const today = new Date().toISOString().split('T')[0];
      const mastered = updatedFlashcards.filter(card => card.level === 5);
      const reviewing = updatedFlashcards.filter(card => new Date(card.nextReviewDate).toISOString().split('T')[0] <= today);
      const learning = updatedFlashcards.filter(card => card.level < 5);

      setMasteredCount(mastered.length);
      setReviewingCount(reviewing.length);
      setLearningCount(learning.length);
    } catch (err) {
      console.error('Error updating flashcard:', err);
    }
  };

  const handleCardClick = (cardId) => {
    if (flippedCard === cardId) return;
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  // Calculate progress percentages for today's due flashcards
  const totalFlashcards = reviewingCount;
  const attemptedPercentage = totalFlashcards === 0 ? 0 : (attemptedCount / totalFlashcards) * 100;
  const knownPercentage = totalFlashcards === 0 ? 0 : (knownCount / totalFlashcards) * 100;

  return (
    <div className="text-white ">
      {/* Navbar */}
      <nav className="w-[100%] bg-gray-800 p-4 fixed top-0 z-10">
        <div className="  flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-semibold">Flashcard App</Link>
          <div className="space-x-4">
            <Link to="/login" className="text-white">Login</Link>
            <Link to="/signup" className="text-white">Sign Up</Link>
          </div>
        </div>
      </nav>

      <h1 className="text-4xl font-bold text-center mb-8">Flashcards</h1>

      <div className="my-12 text-center flex flex-col items-center space-y-4">
        <Link to="/add" className="text-lg font-semibold text-blue-500 hover:underline">
          Add a new card here
        </Link>
        <Link to="/delete" className="text-lg font-semibold text-blue-500 hover:underline">
          Edit here
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 justify-items-center  mx-10 my-10">
        {flashcards.length > 0 ? (
          <div
            key={flashcards[currentCardIndex]._id}
            className="w-full h-[250px] md:w-[250px] lg:w-[800px] bg-gradient-to-br from-gray-800 to-gray-900 text-center flex flex-col items-center justify-center rounded-lg shadow-lg transform transition duration-300 ease-in-out relative overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(flashcards[currentCardIndex]._id)}
          >
            {flippedCard === flashcards[currentCardIndex]._id ? (
              <div className="absolute w-full h-full flex items-center justify-center p-4 text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg transform">
                <div>
                  <p className="text-lg">{flashcards[currentCardIndex].answer}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleAnswer(flashcards[currentCardIndex]._id, true)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      I know it
                    </button>
                    <button
                      onClick={() => handleAnswer(flashcards[currentCardIndex]._id, false)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      I don't know it
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute w-full h-full flex items-center justify-center p-4">
                <p className="text-2xl md:text-3xl font-semibold mb-4">{flashcards[currentCardIndex].question}</p>
                <div className="absolute bottom-0 p-4 w-full bg-black bg-opacity-50 text-white text-lg">
                  Click to see Meaning
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No flashcards due for review</p>
        )}
      </div>

      

        {/* Progress Bars */}
        <div className="mb-8 mx-16">
        <p>Today's Due Flashcards: {totalFlashcards} words</p>
        <p>Attempted: {attemptedCount} out of {totalFlashcards}</p>
        <div className="w-full bg-gray-700 h-4 mb-4">
          <div className="bg-blue-500 h-full" style={{ width: `${attemptedPercentage}%` }}></div>
        </div>

        <p>Known: {knownCount} out of {totalFlashcards}</p>
        <div className="w-full bg-gray-700 h-4 mb-4">
          <div className="bg-green-500 h-full" style={{ width: `${knownPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;
