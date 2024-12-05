//import necessary dependencies
const express = require("express");
const router = express.Router(); //helps to set up routes
const path = require('path');
const { contact } = require('../controllers/pubController')
const { check } = require("express-validator");

//route to buyer signup page
router.get("/signup", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "sign-up.html"));
});

//route to buyer login page
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

//route to contact us page
router.get("/contact", (req, res) => {

  res.sendFile(path.join(__dirname, "../..", "Fronted", "contact-us.html"));
});

//route to about  us page
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "Fronted", "about-us.html"));
})

//route to receive contact us message
router.post('/contact', [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('subject').notEmpty().withMessage('Subject is required'),
  check('message').notEmpty().withMessage('Message is required')
], contact)

//product description route
router.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "Fronted", "product-description.html"));
});

//product review route

module.exports = router;