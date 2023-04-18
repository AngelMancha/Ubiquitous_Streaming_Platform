const socket = io();

let video = document.getElementById("video");
var mensaje = document.getElementById("mensaje");
const listaNotas = document.getElementById("lista-notas");

var cambio;
var cambio_yaw;
var forward = false;
var backward = false;
var isPause = true;

// Crear un evento personalizado
let adelanto = new CustomEvent('adelanto', {
  bubbles: true, // Indicar si el evento se propaga en la fase de burbujeo
  cancelable: true, // Indicar si el evento se puede cancelar
  detail: {}
});
let retraso = new CustomEvent('retraso', {
  bubbles: true,
  cancelable: true,
  detail: {}
});

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

        video.currentTime += 10;
        video.dispatchEvent(adelanto);
        forward = true;
        cambio_yaw = 3;
      }

      if (data.yaw > 2 && backward === false) {
        video.currentTime -= 10;
        video.dispatchEvent(retraso);
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


    socket.on('play_touch', function() {
      video.play();
      console.log("PLAY VIS");
    });

    socket.on('pause_touch', function() {
      video.pause();
      console.log("PAUSE VIS");
    });

    socket.on('adelanto_touch', function() {
      video.currentTime += 10;
      video.dispatchEvent(adelanto);
      console.log("ADELANTO VIS");
    });

    socket.on('retraso_touch', function() {
      video.currentTime -= 10;
      video.dispatchEvent(retraso);
      console.log("RETRASO VIS");
    });
    socket.on('NOTA_ANADIDA', function() {
      console.log ("EN EL VIZ NOTA NUEVA");
      let newItem = document.createElement("li");
      let convertedTime = convertTime(video.currentTime);
      newItem.textContent = "Nota en: " + convertedTime;
      listaNotas.appendChild(newItem);
      printList ();
    });

});

function convertTime(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = segundos % 60;
  let cerosMinutos = (minutos < 10 ? "0" : "");
  let cerosSegundos = (segundosRestantes < 10 ? "0" : "");

  return cerosMinutos + minutos + ":" + cerosSegundos + segundosRestantes.toFixed(0);
}




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

    video.addEventListener('adelanto', function () {
      console.log('El video se ha adelantado');
      // emitir un evento "pause" a través del socket
      socket.emit('adelanto');
    });

    video.addEventListener('retraso', function () {
      console.log('El video se ha retrasado');
      // emitir un evento "pause" a través del socket
      socket.emit('retraso');
    });




function printList() {;
    let items = listaNotas.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
      console.log(items[i].textContent);
    }
}


    /*
var lastTime = video.currentTime;
    // cuando el video se actualiza en tiempo real
    video.addEventListener('timeupdate', function() {
function anadirnota(){
  console.log ("EN EL VIZ NOTA NUEVA");
}
      // obtener la posición actual del video en segundos
      var currentTime = video.currentTime;

      // determinar si el usuario adelantó o retrocedió el video
      if (currentTime > lastTime) {
        console.log('El usuario adelantó el video');
        // emitir un evento "forward" a través del socket
        socket.emit('forward', { currentTime: currentTime });
      } else if (currentTime < lastTime) {
        console.log('El usuario retrocedió el video');
        // emitir un evento "backward" a través del socket
        socket.emit('backward', { currentTime: currentTime });
      }

      // actualizar la última posición del video
      lastTime = currentTime;
    });

*/
