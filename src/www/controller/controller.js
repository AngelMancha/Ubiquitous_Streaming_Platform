const socket = io();

let started = false;
let touch = false;
let accelerometer;
let absOrientation;


const divElem = document.getElementById("msg-container");

console.log("started:", started);

async function toggleStart() {
  started = !started;
  console.log("funcion started:", started);
  if (started) {

    divElem.innerText = "Sending data \nTap again to stop";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
  } else {
    
    divElem.innerText = "Tap to Start";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.stop();
    if (absOrientation) absOrientation.stop();

  }
}


async function touchStart() {
  touch = !touch;
  const divElem = document.querySelector("#touch");
  if (touch) {

   // divElem.innerText = "Tap to start";
    divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.stop();
    if (absOrientation) absOrientation.stop();
    console.log("ESTAMOS EN TOUCH");
  } else {
   // divElem.innerText = "Sending data \nTap again to stop";
   // divElem.style.backgroundColor = "#262626";
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
    console.log("ESTAMOS EN GESTO");
  }
}

//.addEventListener("click", toggleStart());

if (touch === false) {
// Si detecta movimiento
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
  console.log('Conectado al servidor');


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
