const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // If you have a separate DB connection file
const http = require('http');
const socketIo = require('socket.io');
const flashcardRoutes = require('./routes/flashcardRoutes'); // Your routes for flashcards
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User'); // Your User model

const app = express();

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the server

// Middleware
app.use(express.json());  // Body parser for JSON
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));

// Connect to MongoDB
connectDB(); // Assuming you have a function to connect to MongoDB

// Flashcard Routes
app.use('/api/flashcards', flashcardRoutes);  // Assuming flashcard routes are in the `routes` folder
app.use('/api/auth', userRoutes); // User routes

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Example of sending a message to the client
  socket.emit('message', 'Welcome to the Flashcards app!');

  // Handling a sample event from the client
  socket.on('sendAnswer', (data) => {
    console.log('Answer received:', data);
    // You can implement custom logic like updating flashcard boxes here
    socket.emit('message', 'Answer recorded');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res)=>{
  res.send('API is running...');
})

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
