const express = require('express');
const Flashcard = require('../models/Flashcard');
const router = express.Router();

// Add a new flashcard
// routes/flashcardRoutes.js
router.post('/add', async (req, res) => {
    try {
        const { question, answer, level, nextReviewDate } = req.body;
        console.log(question);
        console.log(answer);
        console.log(level);
        console.log(nextReviewDate);

        if (!question || !answer) {
            return res.status(400).json({ error: 'Please provide both question and answer.' });
        }

        // Create a new flashcard instance
        const newFlashcard = new Flashcard({
            question,
            answer,
            level: level || 1,  // Default to Box 1 if not provided
            nextReviewDate: nextReviewDate || new Date(),  // Default to the current date if not provided
          });

        // Save the flashcard to the database
        await newFlashcard.save();

        // Return the newly created flashcard (with the UUID)
        res.status(201).json(newFlashcard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get all flashcards
router.get('/all', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({});
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all/:userId', async (req, res) => { 
  try {
    // Assuming userId is a parameter in the URL
    const flashcards = await Flashcard.find({ userId: req.params.userId });
    
    // If no flashcards are found, send an empty array
    if (!flashcards) {
      return res.status(404).json({ message: "No flashcards found for this user." });
    }
    
    res.json(flashcards); // Send the list of flashcards
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).json({ error: err.message });
  }
});


// Update flashcard level (Leitner System)
router.put('/update/:id', async (req, res) => {
    const { level, nextReviewDate } = req.body;
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(
          req.params.id,
          { level, nextReviewDate },
          { new: true }
        );
    
        res.status(200).json(updatedFlashcard);
      }  catch (err) {
        res.status(500).json({ error: "Failed to update flashcard" });
      }
});

// Delete flashcard
router.delete('/delete/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
