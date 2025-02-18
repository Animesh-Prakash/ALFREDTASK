import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlashCardDelete = () => {
  const [flashcards, setFlashcards] = useState([]);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flashcards/all");
        setFlashcards(response.data);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
      }
    };
    fetchFlashcards();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/flashcards/delete/${id}`);
      setFlashcards(flashcards.filter(flashcard => flashcard._id !== id));
      alert("Flashcard deleted successfully");
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      alert("Failed to delete flashcard");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-center mb-8">All Flashcards</h1>

      <div className="grid grid-cols-1 gap-8 justify-items-center">
        {flashcards.length > 0 ? (
          flashcards.map((flashcard) => (
            <div
              key={flashcard._id}
              className="w-full md:w-[250px] lg:w-[800px] bg-gradient-to-br from-gray-800 to-gray-900 text-center flex flex-col items-center justify-center rounded-lg shadow-lg p-4"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{flashcard.question}</h2>
                <p className="text-lg">{flashcard.answer}</p>
              </div>
              <div className="flex space-x-4">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(flashcard._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(flashcard._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No flashcards available</p>
        )}
      </div>
    </div>
  );
};

export default FlashCardDelete;
