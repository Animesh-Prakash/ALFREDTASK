const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
require("dotenv").config();
const authenticateToken = require("../middleware/authenticateToken");

const checkAdmin = async (req, res, next) => {
    try {
      const userEmail = req.user.email; 
      const adminEmails = ["animeshp1607@gmail.com"]; 
  
      if (!adminEmails.includes(userEmail)) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }
  
      next(); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during role check" });
    }
  };
  
  router.get("/admin/dashboard", authenticateToken, checkAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the admin dashboard" });
  });
  

module.exports = router;
