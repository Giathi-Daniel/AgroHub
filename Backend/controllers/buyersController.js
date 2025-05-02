//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult, check } = require("express-validator");

//register user
exports.registerBuyer = async (req, res) => {
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
  } = req.body; //fetching the input parameter from the request body
  try {
    //checking if a user exist in database
    const [buyer] = await db.execute(
      "SELECT email FROM buyers WHERE email = ?",
      [email]
    );

    //statement to check if the email exist
    if (buyer.length > 0) {
      //if user exist
      return res
        .status(409)
        .json({ status: 409, success: false, message: "User already exist" });
    }

    //if user does not exist
    //proceed to hash password
    const password_hash = await bcrypt.hash(password, 10); //10 is the number of rounds for the salt
    //salt - random characters added to the password during the hashing process to make it more secure

    //insert the user record to the database
    const sql =
      "INSERT INTO buyers (first_name, last_name, email, password_hash, phone_number, country, state, LGA, address, terms, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      'Accepted',
      "Active",
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
exports.loginBuyer = async (req, res) => {
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
    const [buyer] = await db.execute("SELECT * FROM buyers WHERE email = ?", [
      email,
    ]);

    //statement to check if the email exist
    if (!buyer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist",
      });
    }

    //if user account is disabled by admin
    if (buyer[0].status === "Disabled") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Account disabled. Please contact admin on contact us page for reactivation.",
      });
    }

    //if user exist
    //proceed to compare password
    const isMatch = await bcrypt.compare(password, buyer[0].password_hash); //to compare the password

    if (!isMatch) {
      //if password does not match
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password is incorrect",
      });
    }

    //if password match
    req.session.buyer = buyer[0]; //user session object to hold users data
    req.y
    .cart = []; //user session object to hold cart for buyer's purchase
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
exports.getBuyer = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  //convert image blob to url
  const imageBlob = req.session.buyer.image_data; // Adjust this line based on actual data structure

  // Convert the blob to an image URL
  // const image_url = URL.createObjectURL(imageBlob);

  //if user is not logged in
  const buyer = {
    buyer_id: req.session.buyer.buyer_id,
    first_name: req.session.buyer.first_name,
    last_name: req.session.buyer.last_name,
    email: req.session.buyer.email,
    phone_number: req.session.buyer.phone_number,
    country: req.session.buyer.country,
    state: req.session.buyer.state,
    LGA: req.session.buyer.LGA,
    address: req.session.buyer.address,
    terms: req.session.buyer.terms,
    // image_data: image_url,
    date_joined: req.session.buyer.created_at
  };

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Data retrieved successfully!",
    buyer: buyer,
  });
};

//edit user information
exports.editBuyer = async (req, res) => {
  //check if user is logged in
  if (!req.session.buyer) {
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

   //convert file with buffer
   const image_data = req.file.buffer; //get file data as a buffer
   const image_name = req.file.originalname;
 
   //check if file exist
   if (!image_data) {
     return res.status(400).json({
       status: 400,
       success: false,
       message: "Please upload an image",
     });
   }
 

  //if no error is present in validation ans user is logged in
  const { first_name, last_name, phone_number, country, state, LGA, address } =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [buyer] = await db.execute(
      "SELECT * FROM buyers WHERE buyer_id = ?",
      [req.session.buyer.buyer_id]
    );

    //statement to check if the email exist
    if (!buyer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist exist",
      });
    }

    await db.execute(
      "UPDATE buyers SET first_name = ?, last_name =?, phone_number = ?, country = ?, state = ?, LGA =?, address = ?, image_data = ?, image_name = ? WHERE buyer_id = ?",
      [
        first_name,
        last_name,
        phone_number,
        country,
        state,
        LGA,
        address,
        image_data,
        image_name,
        req.session.buyer.buyer_id,
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
exports.logoutBuyer = (req, res) => {
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
    res.redirect('/')
  });
};

//delete buyers account
exports.deleteBuyer = async (req, res) => {
   //check if user is logged in
  if (!req.session.buyer) {
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

  try {
    //delete buyers account
    await db.execute('DELETE FROM buyers WHERE buyer_id = ?', [req.session.buyer.buyer_id])
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