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
import { AuthProvider } from './components/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); 
    }
  }, []);

  return (
    <AuthProvider>
       <Router>
      <div className="mt-16">
        <Routes>
          <Route 
            path="/" 
            element={ <FlashcardList /> } 
          />
          
          <Route 
            path="/flashcards" 
            element={ <FlashcardList /> } 
          />
          <Route 
            path="/add" 
            element={ <FlashCardAdd />} 
          />
                    <Route path="/admin" element={<AdminDashboard />} />

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
    </AuthProvider>
   
  );
}

export default App;
