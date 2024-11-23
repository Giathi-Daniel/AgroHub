//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

//register user
exports.registerFarmer = async (req, res) => {
  //configure the variable to hold the errors
  const errors = validationResult(req); //validation will be carried out on the route

  //check if any error is present in validation
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please correct input errors",
      errors: errors.array(),
    });
  }

  //if no error is present in validation
  const {
    first_name,
    last_name,
    farm_name,
    farm_size,
    email,
    password,
    phone_number,
    country,
    state,
    LGA,
    address,
    terms,
  } = req.body; //fetching the input parameter from the request body
  try {
    //checking if a user exist in database
    const [farmer] = await db.execute(
      "SELECT email FROM farmers WHERE email = ?",
      [email]
    );

    //statement to check if the email exist
    if (farmer.length > 0) {
      //if user exist
      return res
        .status(400)
        .json({ status: 400, success: false, message: "User already exist" });
    }

    //if user does not exist
    //proceed to hash password
    const password_hash = await bcrypt.hash(password, 10); //10 is the number of rounds for the salt
    //salt - random characters added to the password during the hashing process to make it more secure

    //insert the user record to the database
    const sql =
      "INSERT INTO farmers (first_name, last_name, farm_name, farm_size, email, password_hash, phone_number, country, state, LGA, address, terms, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const value = [
      first_name,
      last_name,
      farm_name,
      farm_size,
      email,
      password_hash,
      phone_number,
      country,
      state,
      LGA,
      address,
      terms,
      "Pending",
    ];
    await db.execute(sql, value);
    return res.status(201).json({
      status: 201,
      success: true,
      message: "New user registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error registering user",
      error: error,
    });
  }
};

//log in user
exports.loginFarmer = async (req, res) => {
  //configure the variable to hold the errors
  const errors = validationResult(req); //validation will be carried out on the route

  //check if any error is present in validation
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please correct input errors",
      errors: errors.array(),
    });
  }

  //if no error is present in validation
  const { email, password } = req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [farmer] = await db.execute("SELECT * FROM farmers WHERE email = ?", [
      email,
    ]);

    //statement to check if the email exist
    if (!farmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist exist",
      });
    }

    //if farmers account is disabled
    if (farmer[0].status === "Disabled") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Account disabled",
      });
    }

    //if farmers account is pending
    if (farmer[0].status === "Pending") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Account verification in progress...",
      });
    }

    //if user exist
    //proceed to compare password
    const isMatch = await bcrypt.compare(password, farmer[0].password_hash); //to compare the password

    if (!isMatch) {
      //if password does not match
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password is incorrect",
      });
    }

    //if password match
    req.session.farmer = farmer[0]; //user session object to hold users data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error logging user",
      error: error,
    });
  }
};

//get user information
exports.getFarmer = (req, res) => {
  //check if a user is logged in
  if (!req.session.farmer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }
  //if user is not logged in
  const farmer = {
    farmer_id: req.session.farmer.farmer_id,
    first_name: req.session.farmer.first_name,
    last_name: req.session.farmer.last_name,
    farm_name: req.session.farmer.farm_name,
    farm_size: req.session.farmer.farm_size,
    email: req.session.farmer.email,
    phone_number: req.session.farmer.phone_number,
    country: req.session.farmer.country,
    state: req.session.farmer.state,
    LGA: req.session.farmer.LGA,
    address: req.session.farmer.address,
    terms: req.session.farmer.terms,
  };

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Data retrieved successfully!",
    farmer: farmer,
  });
};

//edit user information
exports.editFarmer = async (req, res) => {
  //check if user is logged in
  if (!req.session.farmer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  //configure the variable to hold the server side validation errors
  const errors = validationResult(req); //validation will be carried out on the route

  //check if any error is present in validation
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please correct input errors",
      errors: errors.array(),
    });
  }

  //if no error is present in validation ans user is logged in
  const {
    first_name,
    last_name,
    farm_name,
    farm_size,
    phone_number,
    country,
    state,
    LGA,
    address,
  } = req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [farmer] = await db.execute(
      "SELECT * FROM farmers WHERE farmer_id = ?",
      [req.session.farmer.farmer_id]
    );

    //statement to check if the email exist
    if (!farmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist exist",
      });
    }

    await db.execute(
      "UPDATE farmers SET first_name = ?, last_name =?, farm_name = ?, farm_size = ?, phone_number = ?, country = ?, state = ?, LGA =?, address = ? WHERE farmer_id = ?",
      [
        first_name,
        last_name,
        farm_name,
        farm_size,
        phone_number,
        country,
        state,
        LGA,
        address,
        req.session.farmer.farmer_id,
      ]
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Details updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error updating details",
      error: error,
    });
  }
};

//log out user
exports.logoutFarmer = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error logging out user",
        error: err,
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "logout successful!",
    });
  });
};

//delete farmers account
exports.deleteFarmer = async (req, res) => {
  //check if user is logged in
 if (!req.session.farmer) {
   //if user is not logged in
   return res.status(401).json({
     status: 401,
     success: false,
     message: "Unauthorised! farmer not logged in",
   });

 }

 //configure the variable to hold the server side validation errors
 const errors = validationResult(req); //validation will be carried out on the route

 //check if any error is present in validation
 if (!errors.isEmpty()) {
   return res.status(400).json({
     status: 400,
     success: false,
     message: "Please correct input errors",
     errors: errors.array(),
   });
 }

 try {
   //delete buyers account
   await db.execute('DELETE FROM farmers WHERE farmer_id = ?', [req.session.farmer.farmer_id])
   return res.status(200).json({
     status: 200,
     success: true,
     message: "Account deleted successfully!"
   });
 } catch (error){
   console.error(error)
   return res.status(500).json({
     status: 500,
     success: false,
     message: "Error deleting account!",
     error: error
   });
 }
}
