const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("VIS_CONNECTED", () => {
    visSocket = socket;
  });

  socket.on("ACC_DATA", (data) => {
    if (visSocket) visSocket.emit("ACC_DATA", data);
  });

  socket.on("ORIENTATION_DATA", (data) => {
    if (visSocket) visSocket.emit("ORIENTATION_DATA", data);
  });
  
});

server.listen(3000, () => {
  console.log("Server listening...");
});


