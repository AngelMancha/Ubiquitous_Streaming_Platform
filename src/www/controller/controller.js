const socket = io();

let started = false;
let accelerometer;
let absOrientation;

async function toggleStart() {
  started = !started;
  const divElem = document.querySelector("#msg-container");
  if (started) {
    document.documentElement.requestFullscreen();
    await screen.orientation.lock("portrait");
    divElem.innerText = "Sending data \nTap again to stop";
    divElem.style.backgroundColor = "#00ff00";
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
  } else {
    await screen.orientation.unlock();
    document.exitFullscreen();
    divElem.innerText = "Tap to start";
    divElem.style.backgroundColor = "#ff0000";
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
      socket.emit("ORIENTATION_DATA", { roll: angles.roll, pitch: angles.pitch, yaw: angles.yaw});
    };


  } catch (err) {
    console.log(err);
  }
}

function toEulerRollPitchYaw(q) {
  const sinr_cosp = 2 * (q[3] * q[0] - q[1] * q[2]);
  const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
  const roll = Math.atan2(sinr_cosp, toEuler);

  const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
  const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] + q[0] * q[2]));
  const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

  const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
  const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
}

