//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


//activate new or disabled farmer
exports.activateFarmer = async (req, res) => {
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

  //if no error is present in validation and user is logged in
  const { farmer_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [newFarmer] = await db.execute("SELECT * FROM farmers WHERE farmer_id = ?", [
      farmer_id,
    ]);

    //statement to check if the email exist
    if (!newFarmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Farmer does not exist exist",
      });
    }

    await db.execute(
      "UPDATE farmers SET status = ? WHERE farmer_id = ?",
      [
        'Active',
        farmer_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `Activated farmer_id: ${farmer_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Farmer Id: ${farmer_id} activated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error activating Farmer Id: ${farmer_id}`,
      error: error,
    });
  }
};

exports.deactivateFarmer = async (req, res) => {
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

  //if no error is present in validation and user is logged in
  const { farmer_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [farmer] = await db.execute("SELECT * FROM farmers WHERE farmer_id = ?", [
      farmer_id,
    ]);

    //statement to check if the email exist
    if (!farmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Farmer does not exist exist",
      });
    }

    await db.execute(
      "UPDATE farmers SET status = ? WHERE farmer_id = ?",
      [
        'Disable',
        farmer_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `Deactivated farmer_id: ${farmer_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Farmer Id: ${farmer_id} deactivated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error deactivating Farmer Id: ${farmer_id}`,
      error: error,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }
  
  try {
    //checking if a product exist in database
    const [products] = await db.execute("SELECT * FROM products");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Products retrieved successfully!",
      products: products,
    });

  } catch(error){
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving product",
      error: error,
    });
  }
  
};

exports.searchProducts = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  const { product } = req.body
  
  try {
    //search for products in database by group
    const [productsByName] = await db.execute("SELECT * FROM products WHERE product_name LIKE ?", [`%${product}%`]);

    const [productsByGroup] = await db.execute("SELECT * FROM products WHERE product_group LIKE ?", [`%${product}%`]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Products retrieved successfully!",
      productsByName: productsByName,
      productsByGroup: productsByGroup
    });

  } catch(error){
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving product",
      error: error,
    });
  }

}

