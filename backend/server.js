const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 
const http = require('http');
const socketIo = require('socket.io');
const flashcardRoutes = require('./routes/flashcardRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User'); 

const app = express();

const server = http.createServer(app);
const io = socketIo(server); 

app.use(express.json());  
app.use(cors({
    origin: 'http://localhost:5173', 
}));

connectDB(); 

app.use('/api/flashcards', flashcardRoutes);  
app.use('/api/auth', userRoutes); 

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.emit('message', 'Welcome to the Flashcards app!');

  socket.on('sendAnswer', (data) => {
    console.log('Answer received:', data);
    socket.emit('message', 'Answer recorded');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res)=>{
  res.send('API is running...');
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
