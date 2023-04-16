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
