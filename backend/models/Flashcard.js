// models/Flashcard.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    level: { 
        type: Number,  // Represents the box number (1, 2, 3, etc.)
        default: 1,
    },
    nextReviewDate: { 
        type: Date,
        default: Date.now,
    },
    id: {  // Using 'id' instead of '_id'
        type: String,
        default: uuidv4,
    },
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
