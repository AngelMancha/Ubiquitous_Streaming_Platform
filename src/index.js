const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'www')));

let visSocket;
let conSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("VIS_CONNECTED", () => {
    visSocket = socket;
  });

  socket.on("CON_CONNECTED", () => {
    conSocket = socket;
  });
  
  socket.on("play", (data) => {
    if (conSocket) conSocket.emit("play", data);
    console.log("SE HA ENVIADO PLAY")
  });

  socket.on("pause", (data) => {
    if (conSocket) conSocket.emit("pause", data);
    console.log("SE HA ENVIADO PAUSE")
  });

  socket.on("adelanto", (data) => {
    if (conSocket) conSocket.emit("adelanto", data);
    console.log("SE HA ENVIADO FORWARD");
  });

  socket.on("retraso", (data) => {
    if (conSocket) conSocket.emit("retraso", data);
    console.log("SE HA ENVIADO BACKWARD");
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
