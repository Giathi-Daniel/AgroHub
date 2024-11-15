//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

//register user
exports.registerAdmin = async (req, res) => {
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
    email,
    password,
    phone_number,
    country,
    state,
    LGA,
    address,
    terms,
    access_level,
  } = req.body; //fetching the input parameter from the request body
  try {
    //checking if a user exist in database
    const [admin] = await db.execute(
      "SELECT email FROM admin WHERE email = ?",
      [email]
    );

    //statement to check if the email exist
    if (admin.length > 0) {
      //if user exist
      return res
        .status(400)
        .json({ status: 400, success: false, message: "Admin already exist" });
    }

    //if user does not exist
    //proceed to hash password
    const password_hash = await bcrypt.hash(password, 10); //10 is the number of rounds for the salt
    //salt - random characters added to the password during the hashing process to make it more secure

    //insert the user record to the database
    const sql =
      "INSERT INTO admin (first_name, last_name, email, password_hash, phone_number, country, state, LGA, address, terms, access_level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const value = [
      first_name,
      last_name,
      email,
      password_hash,
      phone_number,
      country,
      state,
      LGA,
      address,
      terms,
      access_level,
      "Active",
    ];
    await db.execute(sql, value);
    return res.status(201).json({
      status: 201,
      success: true,
      message: "New admin registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error registering admin",
      error: error,
    });
  }
};

//log in user
exports.loginAdmin = async (req, res) => {
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
    const [admin] = await db.execute("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    //statement to check if the email exist
    if (!admin.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Admin does not exist exist",
      });
    }

    //if admin is disabled
    if (admin[0].status === "Disabled") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Account Disabled",
      });
    }
    //if user exist
    //proceed to compare password
    const isMatch = await bcrypt.compare(password, admin[0].password_hash); //to compare the password

    if (!isMatch) {
      //if password does not match
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password is incorrect",
      });
    }

    //if password match
    req.session.admin = admin[0]; //user session object to hold users data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error logging in admin",
      error: error,
    });
  }
};

//get user information
exports.getAdmin = (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }
  //if user is not logged in
  const admin = {
    admin_id: req.session.admin.admin_id,
    first_name: req.session.admin.first_name,
    last_name: req.session.admin.last_name,
    email: req.session.admin.email,
    phone_number: req.session.admin.phone_number,
    country: req.session.admin.country,
    state: req.session.admin.state,
    LGA: req.session.admin.LGA,
    address: req.session.admin.address,
    terms: req.session.admin.terms,
    access_level: req.session.admin.access_level,
  };

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Data retrieved successfully!",
    admin: admin,
  });
};

//edit user information
exports.editAdmin = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
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
  const { first_name, last_name, phone_number, country, state, LGA, address } =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [admin] = await db.execute("SELECT * FROM admin WHERE admin_id = ?", [
      req.session.admin.admin_id,
    ]);

    //statement to check if the email exist
    if (!admin.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Admin does not exist exist",
      });
    }

    await db.execute(
      "UPDATE admin SET first_name = ?, last_name =?, phone_number = ?, country = ?, state = ?, LGA =?, address = ? WHERE admin_id = ?",
      [
        first_name,
        last_name,
        phone_number,
        country,
        state,
        LGA,
        address,
        req.session.admin.admin_id,
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
exports.logoutAdmin = (req, res) => {
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
