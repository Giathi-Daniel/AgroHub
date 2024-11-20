//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getAllProduct = async (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
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
  if (!req.session.buyer) {
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

exports.addToCart = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  const { product_id, product_name, price, discount, quantity } = req.body

  req.session.cart.push[{ product_id: product_id, product_name: product_name, price: price, discount: discount, quantity: quantity }]

}

exports.viewCart = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Cart retrieved sucessfully",
    cart: req.session.cart.push,
  });

}

exports.removeFromCart = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  const { productId } = req.body

  const cart = req.session.cart
  cart.forEach(product => {
    if (product.product_id === productId){
      const productIndex = cart.indexOf(product)
      cart.splice(productIndex, 1)
      req.session.cart = cart
    }
  });

  return res.status(200).json({
    status: 200,
    success: true,
    message: "1 item remove from cart",
    cart: req.session.cart,
  });
}

exports.clearCart = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  const cart = req.session.cart
  cart.splice(0, cart.length)
  req.session.cart = cart

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Cart cleared successfully",
    cart: req.session.cart,
  });
}