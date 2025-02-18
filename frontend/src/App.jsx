import { useState, useEffect } from 'react';
import './App.css';
import FlashcardList from './components/FlashCardList';
import FlashCardAdd from './components/FlashCardAdd';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/auth/Signup';
import FlashCardDelete from './components/FlashCardDelete';
import FlashCardEdit from './components/FlashCardEdits';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Set authenticated state if token exists
    }
  }, []);

  return (
    <Router>
      <div className="mt-16">
        <h1 className="text-2xl font-bold">Flashcard App</h1>
        <Routes>
          {/* Only allow access to flashcards if authenticated */}
          <Route 
            path="/" 
            element={ <FlashcardList /> } 
          />
          
          <Route 
            path="/flashcards" 
            element={ <FlashcardList /> } 
          />
          {/* Only allow access to /add page if authenticated */}
          <Route 
            path="/add" 
            element={ <FlashCardAdd />} 
          />
                    <Route path="/admin" element={<AdminDashboard />} />

          {/* Redirect logged-in users to home if they try to visit login page */}
          <Route 
            path="/login" 
            element={ <Login />} 
          />
          <Route 
            path="/signup" 
            element={<Signup/>} 
          />
          <Route 
            path="/edit/:id" 
            element={<FlashCardEdit/>} 
          />
          <Route 
            path="/delete" 
            element={<FlashCardDelete/>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
