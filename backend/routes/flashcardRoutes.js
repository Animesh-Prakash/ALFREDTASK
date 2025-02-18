const express = require('express');
const Flashcard = require('../models/Flashcard');
const router = express.Router();

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

        const newFlashcard = new Flashcard({
            question,
            answer,
            level: level || 1,  
            nextReviewDate: nextReviewDate || new Date(),  
          });

        await newFlashcard.save();

        res.status(201).json(newFlashcard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

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
    const flashcards = await Flashcard.find({ userId: req.params.userId });
    
    if (!flashcards) {
      return res.status(404).json({ message: "No flashcards found for this user." });
    }
    
    res.json(flashcards); 
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/update/:id', async (req, res) => {
    const {question, answer, level} = req.body;
    console.log(question);
    console.log(answer);
    console.log(level);
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(
          req.params.id,
          { question, answer, level },
          { new: true }
        );
    
        res.status(200).json(updatedFlashcard);
      }  catch (err) {
        res.status(500).json({ error: "Failed to update flashcard" });
      }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
