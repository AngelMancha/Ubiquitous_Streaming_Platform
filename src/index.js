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

  //-----------------------------------------
  // Gestos
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
  
  // -------------------------------------
  // Botones
  socket.on("play_touch", (data) => {
    if (visSocket) visSocket.emit("play_touch", data);
    console.log("SE HA ENVIADO PLAY............");
  });

  socket.on("pause_touch", (data) => {
    if (visSocket) visSocket.emit("pause_touch", data);
    console.log("SE HA ENVIADO PAUSE-..........");
  });

  socket.on("adelanto_touch", (data) => {
    if (visSocket) visSocket.emit("adelanto_touch", data);
    console.log("SE HA ENVIADO FORWARD...........");
  });

  socket.on("retraso_touch", (data) => {
    if (visSocket) visSocket.emit("retraso_touch", data);
    console.log("SE HA ENVIADO BACKWARD............");
  });

  // Datos acelerómetro y orientación del móvil
  socket.on("ACC_DATA", (data) => {
    if (visSocket) visSocket.emit("ACC_DATA", data);
  });

  // Añadir nota
  socket.on("NOTA_ANADIDA", (data) => {
    if (visSocket) visSocket.emit("NOTA_ANADIDA", data);
  });
  socket.on("ORIENTATION_DATA", (data) => {
    if (visSocket) visSocket.emit("ORIENTATION_DATA", data);
  });
});

server.listen(3000, () => {
  console.log("Server listening...");
});
