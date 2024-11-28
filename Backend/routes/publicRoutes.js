//import necessary dependencies
const express = require("express");
const router = express.Router(); //helps to set up routes
const path = require('path')

//route to buyer register page
router.get("/register", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "sign-up.html"));
});

//route to buyer register page
router.get("/login", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "sign-in.html"));
});

//route to farmer login page
router.get("/farmer/login", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "farmer-login.html"));
});

//route to farmer register page
router.get("/farmer/register", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "farmer-register.html"));
});

module.exports = router;