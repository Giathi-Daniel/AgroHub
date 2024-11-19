//import necessary dependencies
const express = require("express");
const {
  activateFarmer,
  deactivateFarmer
} = require("../controllers/adminReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

router.put('/activate',[
  check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  
],
activateFarmer )

router.put('/deactivate',[
  check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  
],
deactivateFarmer )