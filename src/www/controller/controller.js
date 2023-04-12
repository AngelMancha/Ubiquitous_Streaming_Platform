const socket = io();

let started = false;
let accelerometer;
let absOrientation;

function switchMode(mode) {
  var filename = "";
  if (mode == 1) filename = "touchIndex.html";
  if (mode == 2) filename = "index.html"
  window.location.href = filename;
}

async function toggleStart() {
  started = !started;
  const divElem = document.querySelector("#msg-container");
  if (started) {

    divElem.innerText = "Sending data \nTap again to stop";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
  } else {
    
    
    divElem.innerText = "Tap to start";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.stop();
    if (absOrientation) absOrientation.stop();

  }
}

document.body.addEventListener("click", toggleStart);


if ('Accelerometer' in window) {
  try {
    accelerometer = new Accelerometer({ frequency: 10 });
    accelerometer.onerror = (event) => {
      // Errores en tiempo de ejecución
      if (event.error.name === 'NotAllowedError') {
        alert('Permission to access sensor was denied.');
      } else if (event.error.name === 'NotReadableError') {
        alert('Cannot connect to the sensor.');
      }
    };
    accelerometer.onreading = (e) => {
      socket.emit("ACC_DATA", { x: accelerometer.x, y: accelerometer.y, z: accelerometer.z });
      
    };


  } catch (error) {
    // Error en la creación del objeto
    if (error.name === 'SecurityError') {
      alert('Sensor construction was blocked by the Permissions Policy.');
    } else if (error.name === 'ReferenceError') {
      alert('Sensor is not supported by the User Agent.');
    } else {
      throw error;
    }
  }
}


if ('AbsoluteOrientationSensor' in window) {
  try {
    absOrientation = new AbsoluteOrientationSensor({ frequency: 10 });

    absOrientation.onreading = (e) => {
      const quat = e.target.quaternion;
      const angles = toEulerRollPitchYaw(quat);
      //console.log("EL PITCH ES ", angles.pitch);
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



socket.on("connect", function(){
  socket.emit("CON_CONNECTED");
  console.log('Conectado al servidor de PUTAuwu');


  // cuando el video en la página de "viz" se está reproduciendo
  socket.on('play', function() {
    const video = document.getElementById('video');
    console.log("play");
    video.play();
  });
  

  // cuando el video en la página de "viz" se detiene
  socket.on('pause', function() {
    const video = document.getElementById('video');
    console.log("pause");
    video.pause();
  });
  
  socket.on('adelanto', function() {
    const video = document.getElementById('video');
    video.currentTime +=10;
    console.log("adelanto");
  });
  
  socket.on('retraso', function() {
    const video = document.getElementById('video');
    video.currentTime -= 10;
    console.log("retraso");
  });
});
/*

var cambio;
var cambio_yaw;
var forward = false;
var backward = false;
var isPause = true;

const video = document.getElementById('video');
function play(data) {
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
  console.log("estoy ADELANTANDO el video");

  video.currentTime += 10;
  forward = true;
  cambio_yaw = 3;
}

if (data.yaw > 2 && backward === false) {
  video.currentTime -= 10;
  console.log("estoy ATRASAAANDOOOOO el video");
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
};*/