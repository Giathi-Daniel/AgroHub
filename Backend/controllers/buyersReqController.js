//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getAllProduct = async (req, res) => {
  //check if a user is logged in
  // if (!req.session.buyer) {
  //   //if user is not logged in
  //   return res.status(401).json({
  //     status: 401,
  //     success: false,
  //     message: "Unauthorised! user not logged in",
  //   });
  // }

  try {
    //checking if a product exist in database
    const [products] = await db.execute("SELECT * FROM products");

    let imageData;
    let allProducts = [];

    //convert image data to url
    await products.forEach((product) => {
      imageData = product.image_data.toString("base64");
      const imageType = product.image_data.type;
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
        image_type: imageType,
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

  const { product } = req.body;

  try {
    //search for products in database by group
    const [productsByName] = await db.execute(
      "SELECT * FROM products WHERE product_name LIKE ?",
      [`%${product}%`]
    );

    const [productsByGroup] = await db.execute(
      "SELECT * FROM products WHERE product_group LIKE ?",
      [`%${product}%`]
    );

    let imageDataByName;
    let allProductsByName = [];
    let imageDataByGroup;
    let allProductsByGroup = [];

    //convert image data to url
    await productsByName.forEach((product) => {
      imageDataByName = product.image_data.toString("base64");
      allProductsByName.push({
        product_id: product.product_id,
        farmer_id: product.farmer_id,
        product_name: product.product_name,
        product_group: product.product_group,
        product_class: product.product_class,
        description: product.description,
        price: product.price,
        discount: product.discount,
        status: product.status,
        image_data: imageDataByName,
        image_name: product.image_name,
      });
    });

    await productsByGroup.forEach((product) => {
      imageDataByGroup = product.image_data.toString("base64");
      allProductsByGroup.push({
        product_id: product.product_id,
        farmer_id: product.farmer_id,
        product_name: product.product_name,
        product_group: product.product_group,
        product_class: product.product_class,
        description: product.description,
        price: product.price,
        discount: product.discount,
        status: product.status,
        image_data: imageDataByGroup,
        image_name: product.image_name,
      });
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Products retrieved successfully!",
      productsByName: productsByName,
      productsByGroup: productsByGroup,
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

exports.getProductsById = async (req, res) => {
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

  const { product_id } = req.body;

  try {
    //search for products in database by group
    const [product] = await db.execute(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

    if (!product.length > 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No product found with that ID",
      });
    }

    //convert image data to base64
    product[0].image_data = product[0].image_data.toString("base64");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Product retrieved successfully!",
      product: product[0],
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

  // const { product_id, product_name, price, discount, quantity, image_data } = req.body;
  const { cart } = req.body; //cart should be an object

  //if cart is empty, insert directly
  // if (req.session.cart.length === 0) {
  //   // req.session.cart.push({
  //   //   product_id: product_id,
  //   //   product_name: product_name,
  //   //   price: price,
  //   //   discount: discount,
  //   //   quantity: quantity,
  //   //   image_data: image_data,
  //   // });
  //   req.session.cart.push(cart);

  //   return res.status(200).json({
  //     status: 200,
  //     success: true,
  //     message: "Items added to cart sucessfully",
  //     cart: req.session.cart,
  //     itemCount: req.session.cart.length,
  //   });
  // }
  let itemFound = false;
  let index;

  console.log(req.session.cart);

  if (req.session.cart.length > 0) {
    req.session.cart.forEach((item) => {
      if (item.product_id === product_id) {
        index = req.session.cart.indexOf(item);
        itemFound = true;
      }
    });
  }

  if (itemFound) {
    req.session.cart[index].quantity += 1;
  } else {
    req.session.cart.push(cart);
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Items added to cart sucessfully",
    cart: req.session.cart,
    itemCount: req.session.cart.length,
  });
};

exports.updateCart = (req, res) => {
  //check if a user is logged in
  if (!req.session.buyer) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! user not logged in",
    });
  }

  const { product_id, quantity } = req.body; //========> validate this in buyerReqRoute

  let itemFound = false;
  let index;

  if (req.session.cart.length > 0) {
    req.session.cart.forEach((item) => {
      if (item.product_id === product_id) {
        index = req.session.cart.indexOf(item);
        itemFound = true;
      }
    });
  }

  //if item is in cart update quantity
  if (itemFound) {
    req.session.cart[index].quantity = quantity;
  } else {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Product not found in cart",
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Cart updated successfully",
    cart: req.session.cart,
    itemCount: req.session.cart.length,
  });
};

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
    cart: req.session.cart,
    itemCount: req.session.cart.length,
  });
};

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

  const { product_id } = req.body;

  const cart = req.session.cart;
  cart.forEach((product) => {
    if (product.product_id === product_id) {
      const productIndex = cart.indexOf(product);
      cart.splice(productIndex, 1);
      req.session.cart = cart;
    }
  });

  return res.status(200).json({
    status: 200,
    success: true,
    message: "1 item remove from cart",
    cart: req.session.cart,
    itemCount: req.session.cart.length,
  });
};

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

  const cart = req.session.cart;
  cart.splice(0, cart.length);
  req.session.cart = cart;

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Cart cleared successfully",
    cart: req.session.cart,
    itemCount: req.session.cart.length,
  });
};

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
    itemCount: req.session.cart.length,
  });
};

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

  let products_price = 0.0;
  let delivery_cost = 0.0;
  let agro_discount = 0.0;
  let final_price = 0.0;

  //check if cart has items
  const cart = req.session.cart;
  if (cart.length === 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please add items to cart...",
    });
  }
  cart.forEach((product) => {
    products_price += product.price * product.quantity;
  });

  try {
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
        `;
    const value = [
      req.session.buyer.buyer_id,
      req.session.buyer.address,
      products_price,
      delivery_cost,
      agro_discount,
      final_price,
      "Purchased",
    ];
    await db.execute(sql, value);

    const sql2 = `
      SELECT shipping_id 
      FROM shipping
      WHERE buyer_id = ? AND created_at LIKE NOW() AND final_price = ? AND shipping_status = ?;
    `;
    const value2 = [req.session.buyer.buyer_id, final_price, "Purchased"];
    const [shipping_id] = await db.execute(sql2, value2);
    console.log(shipping_id);

    //check if shipping_id was returned
    if (!shipping_id.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Shipping id not found...", //set admin trigger
      });
    }

    const sql3 = `
      INSERT INTO shipping_details
        (shipping_id, 
        product_id, 
        quantity,
        price_per_unit, 
        price)
        VALUES (?, ?, ?, ?, ?)
    `;
    cart.forEach(async (product) => {
      const value3 = [
        shipping_id[0].shipping_id,
        product.product_id,
        product.quantity,
        product.price,
        final_price,
      ];

      await db.execute(sql3, value3);
    });

    //clear cart session after checkout
    req.session.cart = [];

    //set trigger for admin

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Check out successful, items are under processing",
      itemCount: req.session.cart.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error carrying out shipment",
      error: error,
    });
  }
};

exports.checkOutHistory = async (req, res) => {
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
    //check if shipment  exist
    const sql = `
      SELECT p.product_name, 
        sd.quantity, 
        sd.price_per_unit, 
        sd.price, 
        f.farm_name,
        s.created_at, 
        s.shipping_address,
        s.shipping_status
      FROM shipping s
      JOIN shipping_details sd
      ON s.shipping_id = sd.shipping_id
      JOIN products p
      ON sd.product_id = p.product_id
      JOIN farmers f
      ON p.farmer_id = f.farmer_id
      WHERE s.buyer_id = ?
      ORDER BY s.created_at DESC 
      LIMIT 10;
    `;
    const [shipments] = await db.execute(sql, [req.session.buyer.buyer_id]);

    //if record is null
    if (!shipments.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No shipment found",
      });
    }

    //if record is returned from database
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Shipments retrieved successfully",
      shipments: shipments[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving shipment data",
      error: error,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  //check if a user is logged in
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

  const { shipping_id } = req.body;

  try {
    //check if shipment exist
    const sql = `
      SELECT * FROM shipping WHERE shipping_id =? AND shipping_status = ?
    `;
    const [shipment] = await db.execute(sql, [shipping_id, "Purchased"]);

    //if record is null
    if (!shipment.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No shipment found",
      });
    }

    //if record is returned from database
    await db.execute(
      "UPDATE shipping SET shipping_status = ? WHERE shipping_id = ?",
      ["Call Back", shipping_id]
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Shipment cancelling under riview", //trigger admin
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error cancelling shipment",
      error: error,
    });
  }
};
