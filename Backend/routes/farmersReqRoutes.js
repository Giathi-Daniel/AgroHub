//import necessary dependencies
const express = require("express");
const {
  uploadProduct,
  getAllProduct,
  editProduct,
  removeProduct
  
} = require("../controllers/farmersReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

//register user route
router.post(
  "/upload",
  [
    check("product_name", "Product name is required").not().isEmpty(), //checking that name is not empty
    check("product_group", "Product group is required").not().isEmpty(), //checking that name is not empty
    check("product_class", "Product class is required").not().isEmpty(), //checking that name is not empty
    check("description", "Description is required").not().isEmpty(), //checking that name is not empty
    check("price", "Price is required").not().isEmpty(), //checking if email is valid
    check("discount", "Discount is required").not().isEmpty(), //checking password length
    check("status", "Status is required").not().isEmpty(), //checking that name is not empty
    check("image_data", "Image is required").not().isEmpty(), //checking that name is not empty
    check("image_name", "Image name is required").not().isEmpty(), //checking that name is not empty
  ],
  uploadProduct
);

router.get('/products', getAllProduct);

router.put('/edit', [
  check("product_name", "Product name is required").not().isEmpty(), //checking that name is not empty
    check("product_group", "Product group is required").not().isEmpty(), //checking that name is not empty
    check("product_class", "Product class is required").not().isEmpty(), //checking that name is not empty
    check("description", "Description is required").not().isEmpty(), //checking that name is not empty
    check("price", "Price is required").not().isEmpty(), //checking if email is valid
    check("discount", "Discount is required").not().isEmpty(), //checking password length
    check("status", "Status is required").not().isEmpty(), //checking that name is not empty
    check("image_data", "Image is required").not().isEmpty(), //checking that name is not empty
    check("image_name", "Image name is required").not().isEmpty(), //checking that name is not empty
], editProduct
)

router.delete('/delete',[
  check("product_id", "Product Id is required").not().isEmpty(), //checking that name is not empty
],
   removeProduct
  );