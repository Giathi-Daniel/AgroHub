//import necessary dependencies
const express = require("express");
const {
  activateFarmer,
  deactivateFarmer,
  getAllProduct,
  searchProducts,
  getBuyers,
  getBuyersByID,
  getBuyersByName,
  callBackShipment,
  reviewShipment,
  cancelledShipments,
  viewAdmin,
  activateAdmin,
  deactivateAdmin
} = require("../controllers/adminReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

router.put(
  "/activate",
  [
    check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  ],
  activateFarmer
);

router.put(
  "/deactivate",
  [
    check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  ],
  deactivateFarmer
);

router.get("/products", getAllProduct);

router.post(
  "/product/search",
  [
    check("product", "Product is required").not().isEmpty(), //checking if search filed is empty
  ],
  searchProducts
);

router.get('/buyers', getBuyers)

router.post('/buyers/id', [
  check('buyer_id', 'Buyer ID is required').not().isEmpty()
], getBuyersByID)

router.post('/buyers/name', [
  check('product_name', 'Prouct Name is required').not().isEmpty()
], getBuyersByName)

router.get('/shipments/call-back', callBackShipment)

router.put('/shipments/review', [
  check('shipping_id', 'Shipping ID is required').not().isEmpty()
], reviewShipment)

router.get('/shipments/cancelled', cancelledShipments)

router.get('/admin/view', viewAdmin)

router.post('/admin/activate', [
  check('admin_id', 'Admin ID required').not().isEmpty()
], activateAdmin)

router.post('/admin/deactivate', [
  check('admin_id', 'Admin ID required').not().isEmpty()
], deactivateAdmin)

module.exports = router;
