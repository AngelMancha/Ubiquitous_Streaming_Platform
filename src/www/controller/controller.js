const socket = io();
let pause = false;
let started = false;
//let touch = false;
let accelerometer;
let absOrientation;

const video = document.getElementById('video');
const divElem = document.getElementById("touch");
let buttons_touch = document.getElementById("buttons-container-touch");
const play_pause = document.getElementById("play-pause");
const retraso = document.getElementById("retraso");
const adelanto = document.getElementById("adelanto");

console.log("started:", started);

/* Deshabilitar el zoom en dispositivos móviles */
window.addEventListener('gesturestart', function(event) {
  event.preventDefault();
});


async function toggleStart() {
  started = !started;
  console.log("funcion started:", started);
  if (started) {

    divElem.innerText = "g";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
    buttons_touch.style.display = "none";
  } else {
    divElem.innerText = "T";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.stop();
    if (absOrientation) absOrientation.stop();
    buttons_touch.style.display = "block";
  }
}

                               

// Si detecta movimiento
if ('AbsoluteOrientationSensor' in window) {
  try {
    absOrientation = new AbsoluteOrientationSensor({ frequency: 10 });

    absOrientation.onreading = (e) => {
      const quat = e.target.quaternion;
      const angles = toEulerRollPitchYaw(quat);
      socket.emit("ORIENTATION_DATA", { roll: angles.roll, yaw: angles.yaw, pitch: angles.pitch});
      
    };


  } catch (err) {
    console.log(err);
  }
}


function toEulerRollPitchYaw(q) {
  const sinr_cosp = 2 * (q[3] * q[0] - q[1] * q[2]);
  const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
  const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] + q[0] * q[2]));
  const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

  const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
  const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
}

video.addEventListener('play', function() {
  pause = false;
});
video.addEventListener('pause', function() {
  pause = true;
});

play_pause.addEventListener("click", function() {
  if (pause === true) {
    socket.emit('play_touch');
    console.log("EN TOUCH PLAY");
  } else {
    socket.emit('pause_touch');
    console.log("EN TOUCH PAUSE");
  }
});
adelanto.addEventListener("click", function() {
    socket.emit('adelanto_touch');
    console.log("EN TOUCH ADELANTE");
});

retraso.addEventListener("click", function() {
  socket.emit('retraso_touch');
  console.log("EN TOUCH RETRASO");
});



 //Cada vez que se realice un cambio en el video de viz, el video de controlador también se actualiza a la vez.
socket.on("connect", function(){
  socket.emit("CON_CONNECTED");
  console.log('Conectado al servidor');
  
  socket.on("VIDEO_SELECTED", function(data){
    video.src = data.src;
  });
  // cuando el video en la página de "viz" se está reproduciendo
  socket.on('play', function() {
    video.play();
  });
  // cuando el video en la página de "viz" se detiene
  socket.on('pause', function() {
    video.pause();
  });
  
  socket.on('adelanto', function() {
    video.currentTime += 10;
  });
  
  socket.on('retraso', function() {
    video.currentTime -= 10;
  });
});

// TOUCH PARA NOTAS
const distanciaUmbral = 20; // 20 pixels, equivalente a aproximadamente 2 cm
let posicionesIniciales = [];
let movimientoDetectado = false;

// detectar tres touch 
// detectar tres touch 
document.addEventListener('touchstart', function(event) {
  movimientoDetectado = false;
  // guardamos posiciones iniciales de los touch
  posicionesIniciales = Array.from(event.touches).map(touch => ({ x: touch.clientX, y: touch.clientY }));

});

// si se mueven los tres dedos, comprobar que se mueva la distancia umbral
document.addEventListener('touchmove', function(event) {
  if (event.touches.length === 3) {
    console.log("3 TOQUES DECTADOS");
    const posicionesActuales = Array.from(event.touches).map(touch => ({ x: touch.clientX, y: touch.clientY }));
    const distanciasRecorridas = posicionesActuales.map((posicionActual, i) => {
      const posicionInicial = posicionesIniciales[i];
      return Math.sqrt(Math.pow(posicionActual.x - posicionInicial.x, 2) + Math.pow(posicionActual.y - posicionInicial.y, 2));
    });
    const todasDistanciasMayoresUmbral = distanciasRecorridas.every(distanciaRecorrida => distanciaRecorrida > distanciaUmbral);
    if (todasDistanciasMayoresUmbral && !movimientoDetectado) {
      // se han detectado tres toques
      movimientoDetectado = true;
      socket.emit("NOTA_ANADIDA");
    }
  }
});
  
// Escucha eventos de finalización del toque en el elemento que desees
document.addEventListener('touchend', function() {
  // Ejecuta el callback si se detecta el movimiento de los tres dedos a la vez
  if (movimientoDetectado) {
    console.log("nota añadida");
    
  }
});

function anadirnota(){
  console.log ("EN EL VIZ NOTA NUEVA");
}
  function writeViewPort() {
    var ua = navigator.userAgent;
    var viewportChanged = false;
    var scale = 0;

    if (ua.indexOf("Android") >= 0 && ua.indexOf("AppleWebKit") >= 0) {
        var webkitVersion = parseFloat(ua.slice(ua.indexOf("AppleWebKit") + 12));
        // targets android browser, not chrome browser (http://jimbergman.net/webkit-version-in-android-version/)
        if (webkitVersion < 535) {
            viewportChanged = true;
            scale = getScaleWithScreenwidth();
            document.write('<meta name="viewport" content="width=640, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + '" />');
        }
    }

    if (ua.indexOf("Firefox") >= 0) {
        viewportChanged = true;
        scale = (getScaleWithScreenwidth() / 2);
        document.write('<meta name="viewport" content="width=640, user-scalable=false, initial-scale=' + scale + '" />');
    }

    if (!viewportChanged) {
        document.write('<meta name="viewport" content="width=640, user-scalable=false" />');
    }

    if (ua.indexOf("IEMobile") >= 0) {
        document.write('<meta name="MobileOptimized" content="640" />');
    }

    document.write('<meta name="HandheldFriendly" content="true"/>');
}

function getScaleWithScreenwidth() {
    var viewportWidth = 640;
    var screenWidth = window.innerWidth;
    return (screenWidth / viewportWidth);
}

writeViewPort();