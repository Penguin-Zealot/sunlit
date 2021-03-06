// code that runs on raspberry pi
const io = require("socket.io-client");
const Gpio = require("onoff").Gpio;

const OPENING = 1; //clockwise
const CLOSING = 0; //anti-clockwise

//24 hour interval
var openInterval;
var closeInterval;

//time till interval start
var openTimeout;
var closeTimeout;

//fetch status and times from backend
var status = "opened"; // opened, closed, moving
var openTime = new Date();
var closeTime = new Date();
openTime.setHours(22, 30); //in UTC (8:30am AEST)
console.log(openTime);
closeTime.setHours(11, 00); // (9pm AEST)
console.log(closeTime);

//set up initial open and close times
resetOpenInterval(openTime);
resetCloseInterval(closeTime);

//socket.io setup
const socket = io("https://sun-lit.herokuapp.com/");

//see connection
socket.on("connect", () => {
  console.log(socket.id);
});

//open curtain, do nothing if motor is still moving
socket.on("pi_toggle", (data) => {
  console.log(data);

  switch (status) {
    case "opened":
      driveMotor((dir = CLOSING));
      break;
    case "closed":
      driveMotor((dir = OPENING));
      break;
    case "moving":
      socket.emit("pi_failure", "failure: motor in operation");
  }
});

//set open time
socket.on("pi_set_open", (data) => {
  console.log(data);
  // TODO: read data from frontend
  let time = new Date(data);
  resetOpenInterval(time);
});

//set close time
socket.on("pi_set_close", (data) => {
  console.log(data);
  let time = new Date(data);
  resetCloseInterval(time);
});

// attempt reconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

//GPIO setup
const ENA = new Gpio(6, "out"); // purple
const STP = new Gpio(13, "out"); // Blue
const DIR = new Gpio(19, "out"); // Green

function driveMotor(dir = OPENING, revs = 1.0, rpm = 4.0) {
  if (status === "moving") return;
  if (status === "closed" && dir === CLOSING) return;
  if (status === "opened" && dir === OPENING) return;
  status = "moving";

  //const stepsPerRev = 200;
  let steps = revs * 200; // 200 steps per rev
  let duration = (revs / rpm) * 60000; //in ms
  let delay = duration / steps / 2; //in ms for half step

  DIR.writeSync(dir);
  const turn = setInterval(() => STP.writeSync(STP.readSync() ^ 1), delay);

  setTimeout(() => {
    clearInterval(turn); // Stop turning
    status = dir === CLOSING ? "closed" : "opened";
    console.log(`Completed with status: ${status}`);
    socket.emit("pi_success", `success: ${status}`);

    STP.writeSync(0);
    DIR.writeSync(0);

    //STP.unexport(); // Unexport GPIO and free resources
    //DIR.unexport();
  }, duration); // after time taken
}

//returns time till in ms
function timeTill(time) {
  var now = new Date();
  var diffInMS = time - now;
  //add 24hrs if date is negative
  if (diffInMS < 0) diffInMS += 24 * 60 * 60 * 1000;
  console.log(MStoHrsMins(diffInMS));
  return diffInMS;
}

function resetOpenInterval(time) {
  if (openTimeout) clearTimeout(openTimeout);
  if (openInterval) clearInterval(openInterval);

  openTimeout = setTimeout(() => {
    driveMotor((dir = OPENING));
    openInterval = setInterval(() => {
      driveMotor((dir = OPENING));
    }, 24 * 60 * 60 * 1000);
  }, timeTill(time));
}

function resetCloseInterval(time) {
  if (closeTimeout) clearTimeout(closeTimeout);
  if (closeInterval) clearInterval(closeInterval);

  closeTimeout = setTimeout(() => {
    driveMotor((dir = CLOSING));
    closeInterval = setInterval(() => {
      driveMotor((dir = CLOSING));
    }, 24 * 60 * 60 * 1000);
  }, timeTill(time));
}

function MStoHrsMins(time) {
  let secs = Math.floor(time / 1000);
  let mins = Math.floor(secs / 60);
  let hrs = Math.floor(mins / 60);

  mins = mins % 60;

  return `in ${hrs} hours and ${mins} mins`;
}
