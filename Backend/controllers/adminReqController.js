//import necessary dependencies
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


//activate admin
exports.activateAdmin = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  //check if admin has access
 if(req.session.admin.access_level !== 1){
  return res.status(401).json({
    status: 401,
    success: false,
    message: "Unauthorised! admin access denied",
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

  //if no error is present in validation and user is logged in
  const { admin_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [admin] = await db.execute("SELECT * FROM admin WHERE admin_id = ?", [
      admin_id,
    ]);

    //statement to check if the email exist
    if (!admin.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No Admin found with that ID",
      });
    }

    await db.execute(
      "UPDATE admin SET status = ? WHERE admin_id = ?",
      [
        'Active',
        admin_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `ACTIVATE admin_id: ${admin_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Admin Id: ${admin_id} activated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error activating Admin Id: ${admin_id}`,
      error: error,
    });
  }
};

//disable admin
exports.deactivateAdmin = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  //check if admin has access
 if(req.session.admin.access_level !== 1){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
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

  //if no error is present in validation and user is logged in
  const { admin_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [admin] = await db.execute("SELECT * FROM admin WHERE admin_id = ?", [
      admin_id,
    ]);

    //statement to check if the email exist
    if (!admin.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No Admin found with that ID",
      });
    }

    //cannot disabled admin with level one access
    if (admin[0].access_level == 1){
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Cannot delete admin with access level 1",
      });
    }

    await db.execute(
      "UPDATE admin SET status = ? WHERE admin_id = ?",
      [
        'Disable',
        admin_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `DEACTIVATE admin_id: ${admin_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Admin ID: ${admin_id} deactivated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error deactivating Admin Id: ${admin_id}`,
      error: error,
    });
  }
};

//delete admin
exports.deleteAdmin = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  //check if admin has access
 if(req.session.admin.access_level !== 1){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
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

  //if no error is present in validation and user is logged in
  const { admin_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [admin] = await db.execute("SELECT * FROM admin WHERE admin_id = ?", [
      admin_id,
    ]);

    //statement to check if the email exist
    if (!admin.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No Admin found with that ID",
      });
    }

    //cannot delete admin with level one access
  if (admin[0].access_level == 1){
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Cannot delete admin with access level 1",
    });
  }

    await db.execute(
      "DELETE FROM admin WHERE admin_id = ?",
      [
        admin_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `DELETE admin_id: ${admin_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Admin ID: ${admin_id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error deactivating Admin Id: ${admin_id}`,
      error: error,
    });
  }
}


//activate new farmer
exports.activateFarmer = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
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

  //if no error is present in validation and user is logged in
  const { farmer_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [newFarmer] = await db.execute("SELECT * FROM farmers WHERE farmer_id = ?", [
      farmer_id,
    ]);

    //statement to check if the email exist
    if (!newFarmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Farmer does not exist exist",
      });
    }

    await db.execute(
      "UPDATE farmers SET status = ? WHERE farmer_id = ?",
      [
        'Active',
        farmer_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `ACTIVATE farmer_id: ${farmer_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Farmer Id: ${farmer_id} activated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error activating Farmer Id: ${farmer_id}`,
      error: error,
    });
  }
};

//disabled existing farmer
exports.deactivateFarmer = async (req, res) => {
  //check if user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
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

  //if no error is present in validation and user is logged in
  const { farmer_id} =
    req.body; //fetching the input parameter from the request body

  try {
    //checking if a user exist in database
    const [farmer] = await db.execute("SELECT * FROM farmers WHERE farmer_id = ?", [
      farmer_id,
    ]);

    //statement to check if the email exist
    if (!farmer.length > 0) {
      //if user does not exist
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Farmer does not exist exist",
      });
    }

    await db.execute(
      "UPDATE farmers SET status = ? WHERE farmer_id = ?",
      [
        'Disable',
        farmer_id
      ]
    );

    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?);', [req.session.admin.admin_id, `DEACTIVATE farmer_id: ${farmer_id}`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Farmer Id: ${farmer_id} deactivated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: `Error deactivating Farmer Id: ${farmer_id}`,
      error: error,
    });
  }
};

//view all farmers
exports.viewFarmers = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
  //if user is not logged in
  return res.status(401).json({
    status: 401,
    success: false,
    message: "Unauthorised! admin not logged in",
  });
 }

 try {
  const [farmers] = await db.execute('SELECT farmer_id, first_name, last_name, email, phone_number, country, state, LGA, address, status FROM farmers;')

  //chheck if admin are in record
  if (!farmers.length > 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No farmers record found",
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Farmers data retrieved successfully",
    farmers: farmers
  });

 } catch (error) {
  console.error(error)
  return res.status(500).json({
    status: 500,
    success: false,
    message: "Error retrieving farmers data",
  });
 }
}

//view all buyers
exports.getBuyers = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  if(req.session.admin.access_level === 3){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
    });
  }

  try {
    //checking if a product exist in database
    const [buyers] = await db.execute("SELECT buyer_id, first_name, last_name, email, phone_number, country, state, LGA, address FROM buyers");

     //log admin activity
   await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH all buyers`])

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Buyers retrieved successfully!",
      buyers: buyers[0],
    });

  } catch(error){
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving buyers",
      error: error,
    });
  }
}



//view buyer by ID
exports.getBuyersByID = async (req, res) => {
   //check if a user is logged in
   if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  if(req.session.admin.access_level === 3){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
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

  const { buyer_id } = req.body
  try {
    //checking if a product exist in database
    const [buyers] = await db.execute("SELECT buyer_id, first_name, last_name, email, phone_number, country, state, LGA, address FROM buyers WHERE buyer_id = ?", [buyer_id]);

     //log admin activity
    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH buyer_id: ${buyer_id}`])

    //if record not found in database
    if (!buyers.length > 0){
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No Buyer with the ID: ${buyer_id} found!`
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Buyer with ID: ${buyer_id} retrieved successfully!`,
      buyers: buyers,
    });

  } catch(error){
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving buyers",
      error: error,
    });
  }
}

//view buyers by name
exports.getBuyersByName = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  if(req.session.admin.access_level === 3){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
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

  const { buyer_name } = req.body
  try {
    //checking if a product exist in database
    const [buyers] = await db.execute("SELECT buyer_id, first_name, last_name, email, phone_number, country, state, LGA, address FROM buyers WHERE first_name LIKE ? OR last_name LIKE ?", [buyer_name, buyer_name]);

     //log admin activity
    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH buyer_name: ${buyer_name}`])

    //if record not found in database
    if (!buyers.length > 0){
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No Buyer with the name ${buyer_name} found!`
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Buyers with name: ${buyer_name} retrieved successfully!`,
      buyers: buyers,
    });

  } catch(error){
    console.log(error)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error retrieving buyers",
      error: error,
    });
  }
}

//view all buyer by email
exports.getBuyersByEmail = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
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

const { email } = req.body
try {
  //checking if a product exist in database
  const [buyers] = await db.execute("SELECT buyer_id, first_name, last_name, email, phone_number, country, state, LGA, address FROM buyers WHERE email = ?", [email]);

   //log admin activity
  await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH buyers_email: ${email}`])

  //if record not found in database
  if (!buyers.length > 0){
    return res.status(400).json({
      status: 400,
      success: false,
      message: `No Buyer with the email: ${email} found!`
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: `Buyers with email: ${email} retrieved successfully!`,
    buyers: buyers,
  });

} catch(error){
  console.log(error)
  return res.status(500).json({
    status: 500,
    success: false,
    message: "Error retrieving buyers",
    error: error,
  });
}
}

//view all products
exports.getAllProduct = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }
  
  try {
    //checking if a product exist in database
    const [products] = await db.execute("SELECT * FROM products");

     //log admin activity
    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCHED all products`])

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

//search products by name or group
exports.searchProducts = async (req, res) => {
  //check if a user is logged in
  if (!req.session.admin) {
    //if user is not logged in
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin not logged in",
    });
  }

  const { product } = req.body
  
  try {
    //search for products in database by group
    const [productsByName] = await db.execute("SELECT * FROM products WHERE product_name LIKE ?", [`%${product}%`]);

    const [productsByGroup] = await db.execute("SELECT * FROM products WHERE product_group LIKE ?", [`%${product}%`]);

     //log admin activity
    await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH product: ${product}`])

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

//delete farmers account
exports.deleteFarmer = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
   //if user is not logged in
   return res.status(401).json({
     status: 401,
     success: false,
     message: "Unauthorised! admin not logged in",
   });
  }

  if(req.session.admin.access_level === 3){
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorised! admin access denied",
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

 const { farmer_id } = req.body

 try {
   //delete buyers account
   await db.execute('DELETE FROM farmers WHERE farmer_id = ?', [farmer_id])

   //log admin activity
   await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `DELETED farmer_id: ${farmer_id}`])

   return res.status(200).json({
     status: 200,
     success: true,
     message: "Account deleted successfully!"
   });
 } catch (error){
   console.error(error)
   return res.status(500).json({
     status: 500,
     success: false,
     message: "Error deleting account!",
     error: error
   });
 }
}

//view all shipments called back by buyer
exports.callBackShipment = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
   //if user is not logged in
   return res.status(401).json({
     status: 401,
     success: false,
     message: "Unauthorised! admin not logged in",
   });
 }

 try {
  const [shipments] = await db.execute('SELECT * FROM shipping WHERE shipping_status = ?;', ["Call Back"])

  //log admin activity
  await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH all call back shipment`])

  if (!shipments.length > 0){
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No call back shipments found",
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Call Back shipment retrieved successully",
    shipments: shipments
  });

 } catch (error){
  console.error(error)
  return res.status(500).json({
    status: 500,
    success: false,
    message: "Error getting call back shipments",
  });
 }
}

//review cancelled shipment
exports.reviewShipment = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
  //if user is not logged in
  return res.status(401).json({
    status: 401,
    success: false,
    message: "Unauthorised! admin not logged in",
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

 const { shipping_id } = req.body

 try {
  await db.execute('UPDATE shipping SET shipping_status =? WHERE shipping_id =?;', ["Cancelled", shipping_id])

  //log admin activity
  await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?,?)', [req.session.admin.admin_id, `REVIEWED cancelled shipment_id: ${shipping_id}`])

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Shipment cancelled successfully"
  });
 } catch (error){
  console.error(error)
  return res.status(500).json({
    status: 500,
    success: false,
    message: "Error reviewing shipment",
  });
 }
}

//view cancelled shipments
exports.cancelledShipments = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
  //if user is not logged in
  return res.status(401).json({
    status: 401,
    success: false,
    message: "Unauthorised! admin not logged in",
  });
}

try {
 const [shipments] = await db.execute('SELECT * FROM shipping WHERE shipping_status = ?;', ["Cancelled"])

 //log admin activity
 await db.execute('INSERT INTO admin_log(admin_id, action) VALUES (?, ?)', [req.session.admin.admin_id, `SEARCH all cancelled shipments`])

 if (!shipments.length > 0){
   return res.status(400).json({
     status: 400,
     success: false,
     message: "No cancelled shipments found",
   });
 }

 return res.status(200).json({
   status: 200,
   success: true,
   message: "Cancelled shipment retrieved successully",
   shipments: shipments
 });

} catch (error){
 console.error(error)
 return res.status(500).json({
   status: 500,
   success: false,
   message: "Error getting cancelled shipments",
 });
}
}

//view all admin
exports.viewAdmin = async (req, res) => {
  //check if user is logged in
 if (!req.session.admin) {
  //if user is not logged in
  return res.status(401).json({
    status: 401,
    success: false,
    message: "Unauthorised! admin not logged in",
  });
 }
 
 //check if admin has access
 if(req.session.admin.access_level !== 1){
   return res.status(401).json({
     status: 401,
     success: false,
     message: "Unauthorised! admin access denied",
   });
 }

 try {
  const [admin] = await db.execute('SELECT admin_id, first_name, last_name, email, phone_number, country, state, LGA, address, status FROM admin;')

  //chheck if admin are in record
  if (!admin.length > 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No admin record found",
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: "Admin data retrieved successfully",
    admin: admin
  });

 } catch (error) {
  console.error(error)
  return res.status(500).json({
    status: 500,
    success: false,
    message: "Error retrieving admin data",
  });
 }
}