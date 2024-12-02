//import necessary dependencies
const db = require("../config/database");
const { validationResult } = require("express-validator");

exports.contact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please correct input errors",
      errors: errors.array(),
    });
  }
  //store the contact us message in the database
  const {name, email, subject, message} = req.body

  try{
    const sql = 'INSERT INTO contact_us(name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)'
    const values = [name, email, subject, message, 'Unread']
    await db.execute(sql, values)
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Message sent successfully"
    });
  }catch(error){
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error sending message",
      error: error,
    });
  };
  
}