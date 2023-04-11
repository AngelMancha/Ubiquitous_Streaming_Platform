const socket = io();

let video = document.getElementById("video");
var mensaje = document.getElementById("mensaje");

var cambio;
var cambio_yaw;
var forward = false;
var backward = false;
var isPause = true;


socket.on("connect", function(){
  socket.emit("VIS_CONNECTED");
  

  socket.on("ORIENTATION_DATA", function(data){
    //console.log("Roll: ", data.roll);
    
      if (data.roll > 0.3 && isPause === false ) { // movil colgado
        
        video.pause();
        cambio = 1;
        mensaje.innerHTML="VIDEO PARADO";
        
        
      }
      if (data.roll > 0.3 && isPause === true ) { // movil colgado
       
        video.play();
        cambio = 2;
        mensaje.innerHTML="VIDEO INICIADO";
       
      }

      if (data.roll < 0) {
       
    
        if (cambio === 1) {
          isPause = true;
        }
        if (cambio === 2) {
          isPause = false;
        }
      }
      
      
     
      if (data.yaw < 0.3 && forward === false) {
        //console.log("estoy ADELANTANDO el video");

        //video.currentTime += 10;
        forward = true;
        cambio_yaw = 3;
      }

      if (data.yaw > 2 && backward === false) {
        //video.currentTime -= 10;
        //console.log("estoy ATRASAAANDOOOOO el video");
        backward = true;
        cambio_yaw = 4;
      }

      if ( data.yaw < 1.5 && data.yaw > 0.3){
        if (cambio_yaw === 3){
        forward = false;
        }

        if (cambio_yaw === 4) {
          backward = false;
        }
      }
    
     //console.log("visualizer:", "row:", data.roll, "pitch:", data.pitch, "yaw:", data.yaw);
      
      
  });
})



    // cuando el video comienza a reproducirse
    video.addEventListener('play', function () {
      console.log('El video comenzó a reproducirse');
      // emitir un evento "play" a través del socket
      socket.emit('play');
    });
  
    // cuando el video se detiene
    video.addEventListener('pause', function () {
      console.log('El video se detuvo');
      // emitir un evento "pause" a través del socket
      socket.emit('pause');
    });




    