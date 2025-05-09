//importing dependencies
const db = require("./config/database"); //for databse connection
const express = require("express"); //for the web server
const bodyParser = require("body-parser"); //for capturing form data
const session = require("express-session"); //for session management
const MySQLStore = require("express-mysql-session")(session); //for storage of session mangement
const dotenv = require("dotenv"); //manage envionment variables
const path = require("path");
const socketio = require("socket.io"); //for interractivity
const multer = require('multer') //for upload

//configuring dotenv to initialize environmental variables
dotenv.config();

//configure multer storage
const multerStorage = multer.memoryStorage()
const upload = multer({storage: multerStorage})

//initialize express
const app = express();

//setting up middleware
app.use(express.static(path.join(__dirname, "..", "Fronted"))); //ref folder outside __dirname
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//configure session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, //1 hour => 3600s
    },
  })
);

//configure routes
app.use("/agrohub/api/buyer", require("./routes/buyersRoutes"));
app.use("/agrohub/api/farmer", require("./routes/farmersRoutes"));
app.use("/agrohub/api/admin", require("./routes/adminRoutes"));

//configure routes for requests
app.use("/agrohub/api/req/buyer", require("./routes/buyersReqRoutes"));
app.use("/agrohub/api/req/farmer", require("./routes/farmersReqRoutes"));
app.use("/agrohub/api/req/admin", require("./routes/adminReqRoutes"));

//configure public routes
app.use('/agrohub/pub', require('./routes/publicRoutes'))

//routes for landing page
app.get("/", (req, res) => {
  // res.status(200).send("Welcome to AgroHub Backend");
  res.sendFile(path.join(__dirname, "..", "Fronted", "index.html"));
});

//start up the server and pass to socket.io
const expressServer = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://127.0.0.1:${process.env.PORT}`);
});

//configure the io variable to hold the connection
const io = socketio(expressServer, {});

//export io connection
module.exports = io;
