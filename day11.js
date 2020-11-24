const {readArrayFromFile} = require("./lib");
const {initComputer, runUntilOutputOrHalt} = require("./computer");

const directionDeltas = [{x: 0, y:-1}, {x:1,y:0}, {x:0,y:1}, {x:-1, y:0}]

const turn = (currDir, turnValue) => {
  return (currDir + (turnValue ? 1 : 3)) % 4
}

const camera = (painted, x, y) => {
  return painted[`${x}:${y}`] ? 1 : 0;
}

const paint = (painted, currX, currY, paintColor) => {
  painted[`${currX}:${currY}`] = paintColor;
}

const paintRegistrationNumber = (computer) => {
  let painted = {}
  let currDir = 0;
  let currX = 0;
  let currY = 0;

  while (!computer.STOP) {
    const cameraValue = camera(painted, currX, currY);

    // input provide:
    //   0 if the robot is over a black panel or
    //   1 if the robot is over a white panel.
    computer.inputs.push(cameraValue);

    runUntilOutputOrHalt(computer);

    // First, it will output a value indicating the color to paint the panel the robot is over:
    //   0 means to paint the panel black, and
    //   1 means to paint the panel white.
    const paintColor = computer.outputs.shift();
    paint(painted, currX, currY, paintColor);

    runUntilOutputOrHalt(computer);

    // Second, it will output a value indicating the direction the robot should turn:
    //   0 means it should turn left 90 degrees, and
    //   1 means it should turn right 90 degrees.
    const turnValue = computer.outputs.shift();

    currDir = turn(currDir, turnValue);
    const directionDelta = directionDeltas[currDir];
    currX += directionDelta.x;
    currY += directionDelta.y;
  }  

  return Object.getOwnPropertyNames(painted).length;
}

const run = () => {
  const program = readArrayFromFile("./input/day11.txt", ",");
  const computer = initComputer(program, [], []);

  const result = paintRegistrationNumber(computer);
  console.log(result);
}

module.exports = { run }