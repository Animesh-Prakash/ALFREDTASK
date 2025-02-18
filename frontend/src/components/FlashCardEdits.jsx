import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import { useParams, useNavigate } from "react-router-dom";

const FlashCardEdits = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [flashcard, setFlashcard] = useState({
    question: "",
    answer: "",
    level: "", 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flashcards/all");
        
        const selectedFlashcard = response.data.find((card) => card._id === id);
        if (selectedFlashcard) {
          setFlashcard(selectedFlashcard);
        }
        
        setLoading(false); 
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("Failed to fetch flashcard data.");
        setLoading(false);  
      }
    };
    fetchFlashcards();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/flashcards/update/${id}`, {
        question: flashcard.question,
        answer: flashcard.answer,
        level: flashcard.level, 
      });

      if (response.status === 200) {
        alert("Flashcard updated successfully");
        navigate("/flashcards");  
      }
    } catch (err) {
      console.error("Error updating flashcard:", err);
      setError("Failed to update flashcard.");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-500 p-4">
      <div className="w-full max-w-lg bg-gray-800 text-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Flashcard</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="question" className="block text-lg mb-2">Question</label>
            <input
              type="text"
              id="question"
              value={flashcard.question}
              onChange={(e) => setFlashcard({ ...flashcard, question: e.target.value })}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="answer" className="block text-lg mb-2">Answer</label>
            <input
              type="text"
              id="answer"
              value={flashcard.answer}
              onChange={(e) => setFlashcard({ ...flashcard, answer: e.target.value })}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-lg mb-2">Level</label>
            <input
              type="number"
              id="level"
              value={flashcard.level}
              onChange={(e) => setFlashcard({ ...flashcard, level: e.target.value })}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-teal-600 to-indigo-700 text-white font-semibold py-3 rounded-md hover:scale-105 transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlashCardEdits;
