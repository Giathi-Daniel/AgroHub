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

  //if no error is present in validation
  const {
    product_name,
    product_group,
    product_class,
    description,
    price,
    discount,
    status,
  } = req.body; //fetching the input parameter from the request body
  try {
    //checking if a product exist in database
    const [product] = await db.execute(
      "SELECT product_name FROM products WHERE product_name = ? AND farmer_id = ?",
      [product_name, req.session.farmer.farmer_id]
    );

    //statement to check if the product exist
    if (product.length > 0) {
      //if user exist
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Product already exist",
      });
    }

    //insert the product record to the database
    const sql =
      "INSERT INTO products (farmer_id, product_name, product_group, product_class, description, price, discount, status, image_data, image_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const value = [
      req.session.farmer.farmer_id,
      product_name,
      product_group,
      product_class,
      description,
      price,
      discount,
      status,
      image_data,
      image_name,
    ];
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
    const [products] = await db.execute(
      "SELECT * FROM products WHERE  farmer_id = ?",
      [req.session.farmer.farmer_id]
    );

    //if no product
    if (!products.length > 0) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "No product found. Please upload a product!",
      });
    }

    let imageData;
    let allProducts = [];
    
    //convert image data to url
    await products.forEach((product) => {
      imageData = product.image_data.toString("base64");
      allProducts.push({
        product_id: product.product_id,
        farmer_id: product.farmer_id,
        product_name: product.product_name,
        product_group: product.product_group,
        product_class: product.product_class,
        description: product.description,
        price: product.price,
        discount: product.discount,
        status: product.status,
        image_data: imageData,
        image_name: product.image_name,
      });
    });
    

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Products retrieved successfully!",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
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
  const {
    product_id,
    product_name,
    product_group,
    product_class,
    description,
    price,
    discount,
    status,
  } = req.body; //fetching the input parameter from the request body

  try {
    //checking if a product exist in database
    const [product] = await db.execute(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

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
      [
        product_name,
        product_group,
        product_class,
        description,
        price,
        discount,
        status,
        image_data,
        image_name,
        product_id,
      ]
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
  const { product_id } = req.body; //fetching the input parameter from the request body

  try {
    //checking if a product exist in database
    const [product] = await db.execute(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

    //statement to check if the email exist
    if (!product.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product does not exist exist",
      });
    }

    await db.execute("DELET FROM products WHERE product_id = ?", [product_id]);

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
};
