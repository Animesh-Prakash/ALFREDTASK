import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FlashCardEdits = () => {
  const { id } = useParams();  // Get the flashcard ID from the URL params
  const navigate = useNavigate();
  const [flashcard, setFlashcard] = useState({
    question: "",
    answer: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/flashcards/all/${id}`);
        setFlashcard(response.data);
        console.log(response.data);
        setLoading(false);  // Set loading to false after data is fetched
      } catch (err) {
        console.error("Error fetching flashcard:", err);
        setError("Failed to fetch flashcard data.");
        setLoading(false);  // Stop loading if there's an error
      }
    };
    fetchFlashcard();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/flashcards/update/${id}`, {
        question: flashcard.question,
        answer: flashcard.answer,
      });

      if (response.status === 200) {
        alert("Flashcard updated successfully");
        navigate("/flashcards");  // Navigate to the flashcards list
      }
    } catch (err) {
      console.error("Error updating flashcard:", err);
      setError("Failed to update flashcard.");
    }
  };

  // Show loading spinner or form based on loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Edit Flashcard</h1>
      
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={flashcard.question}
            onChange={(e) => setFlashcard({ ...flashcard, question: e.target.value })}
            className="bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="answer">Answer</label>
          <input
            type="text"
            id="answer"
            value={flashcard.answer}
            onChange={(e) => setFlashcard({ ...flashcard, answer: e.target.value })}
            className="bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default FlashCardEdits;
