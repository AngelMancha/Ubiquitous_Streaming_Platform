const socket = io();

socket.on("connect", function(){
  socket.emit("VIS_CONNECTED");
  socket.on("ACC_DATA", function(data){
     if (accChart.data.labels.length > maxValues + 2) {
        accChart.data.labels.shift();
        accChart.data.datasets[0].data.shift();
        accChart.data.datasets[1].data.shift();
        accChart.data.datasets[2].data.shift();
      }
      addAccData(data.x, data.y, data.z);
  });

  socket.on("ORIENTATION_DATA", function(data){
     if (orientationChart.data.labels.length > maxValues + 2) {
        orientationChart.data.labels.shift();
        orientationChart.data.datasets[0].data.shift();
        orientationChart.data.datasets[1].data.shift();
        orientationChart.data.datasets[2].data.shift();
      }
      addOrientationData(data.roll, data.pitch, data.yaw);
  });
})

const accCtx = document.querySelector("#accChart").getContext("2d");
const orientationCtx = document.querySelector("#orientationChart").getContext("2d");

const accChart = new Chart(accCtx, {
  type: "line",
  data: {
    labels: [], 
    datasets: [
      {
        label: "X-axis",
        data: [], 
        borderColor: "rgba(0, 0, 255, 1)",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
      {
        label: "Y-axis",
        data: [],
        borderColor: "rgba(0, 255, 0, 1)",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
      },
      {
        label: "Z-axis",
        data: [],
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 1
        }
      }]
    }
  },
});

const orientationChart = new Chart(orientationCtx, {
  type: "line",
  data: {
    labels: [], 
    datasets: [
      {
        label: "Roll",
        data: [],
        borderColor: "rgba(0, 0, 255, 1)",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
      {
        label: "Pitch",
        data: [], 
        borderColor: "rgba(0, 255, 0, 1)",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
      },
      {
        label: "Yaw",
        data: [],
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 0.2
        }
      }]
    }
  },
});

const maxValues = 100;
let accDataCount = 0;
let orientationDataCount = 0;

function addAccData(x, y, z) {
  accChart.data.labels.push(++accDataCount);
  accChart.data.datasets[0].data.push(x);
  accChart.data.datasets[1].data.push(y);
  accChart.data.datasets[2].data.push(z);

  accChart.update();

}

function addOrientationData(x, y, z) {
  orientationChart.data.labels.push(++orientationDataCount);
  orientationChart.data.datasets[0].data.push(x);
  orientationChart.data.datasets[1].data.push(y);
  orientationChart.data.datasets[2].data.push(z);

  orientationChart.update();

}
