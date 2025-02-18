const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Make sure you have the User model
require("dotenv").config();
const authenticateToken = require("../middleware/authenticateToken");

// Admin Check Middleware
// Admin Check Middleware
const checkAdmin = async (req, res, next) => {
    try {
      const userEmail = req.user.email; // Email is decoded from the JWT token
      const adminEmails = ["animeshp1607@gmail.com"]; // Add all admin emails here
  
      // Check if the user email matches an admin email
      if (!adminEmails.includes(userEmail)) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }
  
      next(); // Proceed to the next middleware or route handler if the user is an admin
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during role check" });
    }
  };
  
  // Protected Admin Route
  router.get("/admin/dashboard", authenticateToken, checkAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the admin dashboard" });
  });
  

module.exports = router;
