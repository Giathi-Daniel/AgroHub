//import necessary dependencies
const express = require("express");
const {
  activateFarmer,
  deactivateFarmer,
  viewFarmers,
  deleteFarmer,
  getAllProduct,
  searchProducts,
  getBuyers,
  getBuyersByID,
  getBuyersByName,
  getBuyersByEmail,
  callBackShipment,
  reviewShipment,
  cancelledShipments,
  viewAdmin,
  activateAdmin,
  deactivateAdmin,
  deleteAdmin,
  getMessage,
  getUnread,
  readMessage
} = require("../controllers/adminReqController");
const { check } = require("express-validator"); //for server side validation
const router = express.Router(); //helps to set up routes

router.put(
  "/farmers/activate",
  [
    check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  ],
  activateFarmer
);

router.put(
  "/farmers/deactivate",
  [
    check("farmer_id", "Farmer Id is required").not().isEmpty(), //checking that name is not empty
  ],
  deactivateFarmer
);

router.get('/farmers/view', viewFarmers)

router.delete('/farmers/delete', [
  check("farmer_id", "Farmer ID is required").not().isEmpty(), //checking that ID is not empty
], deleteFarmer)

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

router.post('/buyers/email', [
  check('email', 'Email is required').not().isEmpty()
], getBuyersByEmail)

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

router.delete('/admin/delete', [
  check('admin_id', 'Admin ID is required').not().isEmpty(), //checking that ID is not empty
], deleteAdmin)

router.get('/message', getMessage);

router.get('message/unread', getUnread);

router.put('message/read', [
  check('message_id', 'Message ID is required').not().isEmpty()
], readMessage)

module.exports = router;
