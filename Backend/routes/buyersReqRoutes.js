//import necessary dependencies
const express = require("express");
const {
  getAllProduct,
  searchProducts,
  getProductsById,
  addToCart,
  viewCart,
  updateCart,
  removeFromCart,
  clearCart,
  countCart,
  checkOut,
  checkOutHistory,
  cancelOrder
} = require("../controllers/buyersReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes
const path = require('path')


//routes
router.get('/checkout', (req, res) => {
  //check if buyer is logged in
  if(!req.session.buyer){
    return res.status(402).json({
      status: 402,
      success: false,
      message: 'Unathorised, user not logged in'
    })
  }

  res.sendFile(path.join(__dirname, "../..", "Fronted", "checkout.html"));
})


router.get("/products", getAllProduct);

router.post(
  "/product/search",
  [
    check("product", "Product is required").not().isEmpty(), //checkig if search filed is empty
  ],
  searchProducts
);

router.post(
  "/product/id",
  [
    check("product_id", "Product is required as a number").not().isEmpty().isInt(), //checkig if search filed is empty
  ],
  getProductsById
);

//access to cart page
router.get('/cart', (req, res) => {
  if (!req.session.buyer){
    return res.redirect('/agrohub/pub/login');
  }
  res.sendFile(path.join(__dirname, "../..", "Fronted", "cart.html"));
})

router.post(
  "/cart/add",
  [
    //check if fields are empty
    check("cart", "Cart is required").not().isEmpty(),
    // check("product_id", "Product ID is required").not().isEmpty(),
    // check("product_name", "Product Name is required").not().isEmpty(),
    // check("price", "Price is required").not().isEmpty(),
    // check("discount", "Discount is required").not().isEmpty(),
    // check("quatity", "Quatity is required").not().isEmpty(),
  ],
  addToCart
);

router.get("/cart/items", viewCart);

router.put("/cart/update",[
  check("product-id", "Product ID is required").not().isEmpty(),
  check("quantity", "Quantity is required").not().isEmpty(),
], updateCart);

router.delete(
  "/cart/remove",
  [check("product_id", "Product ID is required").not().isEmpty()],
  removeFromCart
);

router.delete("/cart/clear", clearCart);

router.get("/cart/count", countCart);

router.get('/cart/checkout', checkOut);

router.get('/shipments', checkOutHistory);

router.post('/shipments/cancel', [
  check('shipping_id', 'Shipping ID is required').not().isEmpty()
], cancelOrder);

module.exports = router;
