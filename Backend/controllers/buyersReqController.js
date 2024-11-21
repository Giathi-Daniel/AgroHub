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

exports.countCart = (req, res) => {
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
    message: "Cart items counted successfully",
    itemCount: req.session.cart.length
  });


}

exports.checkOut = async (req, res) => {
   //check if a user is logged in
   if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  let products_price = 0.00
  let delivery_cost = 0.00
  let agro_discount = 0.00
  let final_price = 0.00

  const cart = req.session.cart
  cart.forEach(product => {
    products_price += product.price * product.quantity
  });

  try{
    const sql = `
      INSERT INTO shipping 
        (buyer_id, 
        shipping_address, 
        products_price, 
        delivery_cost, 
        discount, 
        final_price, 
        shipping_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `
    const value = [req.session.buyer.buyer_id, req.session.buyer.address, products_price, delivery_cost, agro_discount, final_price, 'Purchased']
    await db.execute(sql,value)

    const sql2 = `
      SELECT shipping_id 
      FROM shipping
      WHERE buyer_id = ?, created_at = CURRENT_TIMESTAMP(), final_price = ?, status = ?
    `
    const value2 = [req.session.buyer.buyer_id, final_price, 'Purchased']
    const [shipping_id] = await db.execute(sql2, value2)

    //check if shipping_id was returned
    if (!shipping_id.length > 0){
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Shipping id not found...", //set admin trigger
      });
    }

    const sql3 = `
      INSERT INTO shipping_details
        (shipping_id, 
        products_id, 
        quantity,
        price_per_unit, 
        price
        VALUES (?, ?, ?, ?, ?)
    `
    cart.forEach(async product => {
      const value3 = [shipping_id[0].shipping_id, product.product_id, product.quantity, product.price, final_price]

      await db.execute(sql3, value3)

    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Check out successful, items are under processing",
      itemCount: req.session.cart.length
    });
    
  }catch (error){
    console.error(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error carrying out shipment",
      error: error,
    });
  }

}