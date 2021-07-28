// code that runs on raspberry pi
const io = require("socket.io-client");
const Gpio = require("onoff").Gpio;

//socket.io setup
const socket = io("https://sun-lit.herokuapp.com/");

//fetch status from backend
var status = "ok";
// var openTime
// var closeTime

//see connection
socket.on("connect", () => {
  console.log(socket.id);
});

//open curtain, do nothing if motor is still moving
socket.on("pi_open", (data) => {
  console.log(data);
  if (status === "ok") driveMotor((dir = 1));

  socket.emit("pi_message", "success");
});

//close curtain, do nothing if motor is moving
socket.on("pi_close", (data) => {
  driveMotor((dir = 0));

  console.log(data);
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
const RST = new Gpio(29, "out"); // grey
const SLP = new Gpio(31, "out"); // purple

const STP = new Gpio(33, "out"); // Blue
const DIR = new Gpio(25, "out"); // Green

driveMotor();

function driveMotor(dir = 1, revs = 1.0, rpm = 4.0) {
  status = "moving";
  DIR.writeSync(dir);

  //const stepsPerRev = 200;
  let steps = revs * 200; // 200 steps per rev
  let duration = (revs / rpm) * 60000; //in ms
  let delay = duration / steps / 2; //in ms for half step

  const turn = setInterval(() => STP.writeSync(STP.readSync() ^ 1), delay);

  setTimeout(() => {
    clearInterval(turn); // Stop turning
    status = "ok";
    STP.unexport(); // Unexport GPIO and free resources
    DIR.unexport();
  }, duration); // after time taken
}
