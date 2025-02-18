import React, { useState } from 'react';  
import axios from 'axios'; 

const FlashCardAdd = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [level, setLevel] = useState(1); 

  const calculateReviewDate = (level) => {
    const nextReviewDate = new Date();
    const reviewDays = [1, 3, 7, 14, 30]; 
    nextReviewDate.setDate(nextReviewDate.getDate() + reviewDays[level - 1]); 
    return nextReviewDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!question || !answer) {
      alert('Please fill in both fields!');
      return;
    }

    const nextReviewDate = calculateReviewDate(level);

    try {
      const response = await axios.post('http://localhost:5000/api/flashcards/add', { 
        question, 
        answer, 
        level,
        nextReviewDate
      });

      alert('Flashcard added successfully!');
      setQuestion(''); 
      setAnswer('');
      setLevel(1); 
    } catch (err) {
      console.error('Error adding flashcard:', err);
      alert('Failed to add flashcard');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Add a New Flashcard</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-lg font-semibold">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)} 
            className="w-full p-4 mt-2 border-2 border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="answer" className="block text-lg font-semibold">Answer</label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} 
            className="w-full p-4 mt-2 border-2 border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="level" className="block text-lg font-semibold">Select Level</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full p-3 mt-2 border-2 border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Level 1 (Review in 1 day)</option>
            <option value={2}>Level 2 (Review in 3 days)</option>
            <option value={3}>Level 3 (Review in 7 days)</option>
            <option value={4}>Level 4 (Review in 14 days)</option>
            <option value={5}>Level 5 (Review in 30 days)</option>
          </select>
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Flashcard
        </button>
      </form>
    </div>
  );
};

export default FlashCardAdd;
