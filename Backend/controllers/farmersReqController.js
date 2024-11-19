//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

//logic to upload product
exports.uploadProduct = async (req, res) => {
  //check if a user is logged in
  if (!req.session.farmer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }
  //configure the variable to hold the errors
  const errors = validationResult(req); //validation will be carried out on the route

  //check if any error is present in validation
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please correct upload errors",
      errors: errors.array(),
    });
  }

  //if no error is present in validation
  const { product_name, product_group, product_class, description, price, discount, status, image_data, image_name } = req.body; //fetching the input parameter from the request body
  ;
  try {
    //checking if a product exist in database
    const [product] = await db.execute("SELECT product_name FROM products WHERE product_name = ? AND farmer_id = ?", [
      product_name,
      req.session.farmer.farmer_id
    ]);

    //statement to check if the product exist
    if (product.length > 0) {
      //if user exist
      return res
        .status(400)
        .json({ status: 400, success: false, message: "Product already exist" });
    }

    //insert the product record to the database
    const sql = "INSERT INTO products (farmer_id, product_name, product_group, product_class, description, price, discount, status, image_data, image_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const value = [req.session.farmer.farmer_id, product_name, product_group, product_class, description, price, discount, status, image_data, image_name];
    await db.execute(sql, value);
    return res.status(201).json({
      status: 201,
      success: true,
      message: `Product: ${product_name} uploaded successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error uploading product",
      error: error,
    });
  }
};


exports.getAllProduct = async (req, res) => {
  //check if a user is logged in
  if (!req.session.farmer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }
  
  try {
    //checking if a product exist in database
    const [products] = await db.execute("SELECT * FROM products WHERE product_name = ? AND farmer_id = ?", [
      product_name,
      req.session.farmer.farmer_id
    ]);

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

exports.editProduct = async (req, res) => {
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
  const {product_id, product_name, product_group, product_class, description, price, discount, status, image_data, image_name} = req.body; //fetching the input parameter from the request body

  try {
    //checking if a product exist in database
    const [product] = await db.execute("SELECT * FROM products WHERE product_id = ?", [
      product_id,
    ]);

    //statement to check if the email exist
    if (!product.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product does not exist exist",
      });
    }

    await db.execute(
      "UPDATE products SET product_name = ?, product_group =?, product_class = ?, farm_size = ?, phone_number = ?, country = ?, state = ?, LGA =?, description = ?, price = ?, discount = ?, status = ?, image_data = ?, image_name = ? WHERE product_id = ?",
      [product_name, product_group, product_class, description, price, discount, status, image_data, image_name, product_id]
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error updating product",
      error: error,
    });
  }
};

exports.removeProduct = async (req, res) => {
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
  const {product_id} = req.body; //fetching the input parameter from the request body

  try {
    //checking if a product exist in database
    const [product] = await db.execute("SELECT * FROM products WHERE product_id = ?", [
      product_id,
    ]);

    //statement to check if the email exist
    if (!product.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product does not exist exist",
      });
    }

    await db.execute(
      "DELET FROM products WHERE product_id = ?",
      [product_id]
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error deleting product",
      error: error,
    });
  }

}