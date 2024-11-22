//import necessary dependencies
const express = require("express");
const {
  registerFarmer,
  loginFarmer,
  getFarmer,
  editFarmer,
  logoutFarmer,
} = require("../controllers/farmersController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

//register user route
router.post(
  "/register",
  [
    check("first_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("last_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("farm_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("farm_size", "Name is required").not().isEmpty(), //checking that name is not empty
    check("email", "Please provide a valid email").isEmail(), //checking if email is valid
    check("password", "Password must be 6 charcters or more").isLength({
      min: 6,
    }), //checking password length
    check("phone_number", "Phone number is required").not().isEmpty(), //checking that name is not empty
    check("country", "Country is required").not().isEmpty(), //checking that name is not empty
    check("state", "State is required").not().isEmpty(), //checking that name is not empty
    check("LGA", "LGA is required").not().isEmpty(), //checking that name is not empty
    check("address", "Address is required").not().isEmpty(), //checking that name is not empty
  ],
  registerFarmer
);

//login user route
router.post(
  "/login",
  [
    check("email", "Please provide a valid email").isEmail(), //checking if email is valid
    check("password", "Password must be 6 charcters or more").isLength({
      min: 6,
    }), //checking password length
  ],
  loginFarmer
);

//get user info for edit route
router.get("/profile/info", getFarmer);

//edit user info
router.put(
  "/profile/edit",
  [
    check("first_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("last_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("farm_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("farm_size", "Name is required").not().isEmpty(), //checking that name is not empty
    check("phone_number", "Phone number is required").not().isEmpty(), //checking that name is not empty
    check("country", "Country is required").not().isEmpty(), //checking that name is not empty
    check("state", "State is required").not().isEmpty(), //checking that name is not empty
    check("LGA", "LGA is required").not().isEmpty(), //checking that name is not empty
    check("address", "Address is required").not().isEmpty(), //checking that name is not empty
  ],
  editFarmer
);

//log out user
router.get("/logout", logoutFarmer);

module.exports = router;
