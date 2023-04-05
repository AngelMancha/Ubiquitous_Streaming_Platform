const socket = io();

let video = document.getElementById("video");
var mensaje = document.getElementById("mensaje");

var isPause = true;
var cambio;

socket.on("connect", function(){
  socket.emit("VIS_CONNECTED");
  

  socket.on("ORIENTATION_DATA", function(data){
    console.log("Roll: ", data.roll);
      if (data.roll > 0.5 && isPause === false) { // movil colgado
        console.log("PAUSAR VIDEO");
        video.pause();
       // isPause = true;
        cambio = 1;
        mensaje.innerHTML="VIDEO PARADO";
        console.log("ISPUASE DEL PAUSE", isPause);
        
      }
      if (data.roll > 0.5 && isPause === true) { // movil colgado
        console.log("INICIAR VIDEO");
        video.play();
        cambio = 2;
        mensaje.innerHTML="VIDEO INICIADO";
        console.log("ISPUASE DEL PLAY", isPause);
      }

      if (data.roll < 0) {
        console.log("isPause: ", isPause);
        
        if (cambio === 1) {
          isPause = true;
        }
        if (cambio === 2) {
          isPause = false;
        }
      }
      

      /*
      if (data.yaw < 0) {
        video.currentTime += 10;
      }
     */
     // console.log("visualizer:", "row:", data.roll, "pitch:", data.pitch, "yaw:", data.yaw);
      
      
  });
})
