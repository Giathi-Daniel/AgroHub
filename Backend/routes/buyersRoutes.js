//import necessary dependencies
const express = require("express");
const {
  registerBuyer,
  loginBuyer,
  getBuyer,
  editBuyer,
  logoutBuyer,
  deleteBuyer,
  isAuth
} = require("../controllers/buyersController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes
const multer = require('multer') //for upload

//configure multer storage
const multerStorage = multer.memoryStorage()
const upload = multer({storage: multerStorage})

//register user route
router.post(
  "/register",
  [
    check("first_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("last_name", "Name is required").not().isEmpty(), //checking that name is not empty
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
  registerBuyer
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
  loginBuyer
);

//get user info for edit route
router.get("/profile/info", getBuyer);

//edit user info
router.put(
  "/profile/edit", upload.single('image_data'),
  [
    check("first_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("last_name", "Name is required").not().isEmpty(), //checking that name is not empty
    check("phone_number", "Phone number is required").not().isEmpty(), //checking that name is not empty
    check("country", "Country is required").not().isEmpty(), //checking that name is not empty
    check("state", "State is required").not().isEmpty(), //checking that name is not empty
    check("LGA", "LGA is required").not().isEmpty(), //checking that name is not empty
    check("address", "Address is required").not().isEmpty(), //checking that name is not empty
  ],
  editBuyer
);

//log out user
router.get("/logout", logoutBuyer);

//delete buyer 
router.delete('/delete', deleteBuyer);

// check buyer authentication
router.get('/auth-status', isAuth)

module.exports = router;
