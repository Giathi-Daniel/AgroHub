const io = require('../app');

// const socket = io("http://localhost:3300"); //io connection for frontend

io.on("connect", (socket) => {
  console.log(socket.id, "has joined the server");


})