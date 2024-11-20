//import necessary dependencies
const express = require("express");
const {
  getAllProduct,
  searchProducts,
  addToCart,
  viewCart,
  removeFromCart,
  clearCart,
} = require("../controllers/buyersReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

router.get('/products', getAllProduct)

router.post('/product/search', [
  check('product', 'Product is required').not().isEmpty() //checkig if search filed is empty
], searchProducts)

router.post('/add-cart', [
  //check if fields are empty
  check('product_id', 'Product ID is required').not().isEmpty(),
  check('product_name', 'Product Name is required').not().isEmpty(),
  check('price', 'Price is required').not().isEmpty(),
  check('discount', 'Discount is required').not().isEmpty(),
  check('quatity', 'Quatity is required').not().isEmpty()

], addToCart)

router.get('/cart', viewCart)

router.post('/remove-item', [
  check('productId', 'Product ID is required').not().isEmpty()
], removeFromCart)

router.get('/cart/clear', clearCart)