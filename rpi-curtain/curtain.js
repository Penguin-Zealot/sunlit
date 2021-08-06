// code that runs on raspberry pi
const io = require("socket.io-client");
const Gpio = require("onoff").Gpio;

//socket.io setup
const socket = io("https://sun-lit.herokuapp.com/");

//const CLOCKWISE = 1;
//const ANTICLOCKWISE = 0;

//fetch status from backend
var status = "opened"; // opened, closed, moving
// var openTime
// var closeTime

//see connection
socket.on("connect", () => {
  console.log(socket.id);
});

//open curtain, do nothing if motor is still moving
socket.on("pi_toggle", (data) => {
  console.log(data);

  switch (status) {
    case "opened":
      driveMotor((dir = 0));
      break;
    case "closed":
      driveMotor((dir = 1));
      break;
    case "moving":
      socket.emit("pi_message", "failure: motor in operation");
  }
});

//set open time
socket.on("pi_set_open", (data) => {
  console.log(data);
});

//set close time
socket.on("pi_set_open", (data) => {
  console.log(data);
});

// attempt reconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

//GPIO setup
const RST = new Gpio(5, "out"); // grey
const SLP = new Gpio(6, "out"); // purple

const STP = new Gpio(13, "out"); // Blue
const DIR = new Gpio(19, "out"); // Green

driveMotor();

function driveMotor(dir = 1, revs = 1.0, rpm = 4.0) {
  if (status === "moving") return;
  status = "moving";

  //const stepsPerRev = 200;
  let steps = revs * 200; // 200 steps per rev
  let duration = (revs / rpm) * 60000; //in ms
  let delay = duration / steps / 2; //in ms for half step

  DIR.writeSync(dir);
  const turn = setInterval(() => STP.writeSync(STP.readSync() ^ 1), delay);

  setTimeout(() => {
    clearInterval(turn); // Stop turning
    status = dir ? "closed" : "opened";
    console.log(`Nompleted with status: ${status}`);
    socket.emit("pi_message", `Success status: ${status}`);

    STP.writeSync(0);
    DIR.writeSync(0);

    STP.unexport(); // Unexport GPIO and free resources
    DIR.unexport();
  }, duration); // after time taken
}
