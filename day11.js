const {readArrayFromFile} = require("./lib");
const {initComputer, runUntilOutputOrHalt} = require("./computer");
const { createCanvas } = require('canvas')

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
  let currX = 52;
  let currY = 18;
  painted[`${currX}:${currY}`] = 1; // starts on a white square

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

    // drawOutput(painted)
  }  

  return painted;
}

const getCoords = (p) => {
  return Object.getOwnPropertyNames(p);
}

const getMinCoord = (p, axis) => {
  let minCoord = 999999;
  
  getCoords(p).forEach(coord => {
    const coords = coord.split(":");
    const value = parseInt(coords[axis])
    if (value < minCoord) {
      minCoord = value;
    }
  });

  return minCoord;
}

const getMaxCoord = (p, axis) => {
  let maxCoord = -999999;
  
  getCoords(p).forEach(coord => {
    const coords = coord.split(":");
    const value = parseInt(coords[axis])
    if (value > maxCoord) {
      maxCoord = value;
    }
  });

  return maxCoord;
}

// const adjustCoords = (p, adjX, adjY) => {
//   // console.log(`Adjusting by dx:${adjX}, dy:${adjY}`);
//   let newP = {}

//   getCoords(p).forEach(coord => {
//     const coords = coord.split(":");
//     const newCoords = `${parseInt(coords[0]) + adjX}:${parseInt(coords[1]) + adjY}`;

//     // console.log(`${coords} --> ${newCoords}`);
//     newP[newCoords] = p[coord];
//   });

//   return newP;

// }

// const drawOutputText = (p) => {
//   const minCoordX = getMinCoord(p, 0);
//   const minCoordY = getMinCoord(p, 1);

//   if (minCoordX < 0 || minCoordY < 0) {
//     console.log(`min: ${minCoordX}x${minCoordY}`);
//     throw new Error("Fix Offsets")
//   }

//   // const adjP = adjustCoords(p, -minCoordX, -minCoordY)

//   let output = "";
//   const maxX = getMaxCoord(p, 0);
//   const maxY = getMaxCoord(p, 1);
//   console.log(`GRID SIZE: ${maxX}x${maxY}`);
//   for (let y = 0; y <= maxY; y++) {
//     for (let x = 0; x <= maxX; x++) {
//       const char = p[`${x}:${y}`] ? "█" : "░";
//       output += char;
//     }

//     output += "\n";
//   }

//   console.log(output);
// }

const drawOutputImage = (p) => {
  const minCoordX = getMinCoord(p, 0);
  const minCoordY = getMinCoord(p, 1);

  if (minCoordX < 0 || minCoordY < 0) {
    console.log(`min: ${minCoordX}x${minCoordY}`);
    throw new Error("Fix Offsets")
  }

  const maxX = getMaxCoord(p, 0);
  const maxY = getMaxCoord(p, 1);
  console.log(`GRID SIZE: ${maxX}x${maxY}`);
  const canvas = createCanvas(maxX * 5 + 5, maxY * 5 + 5)
  const ctx = canvas.getContext('2d', { pixelFormat: 'A8' })
  ctx.fillStyle = 'rgba(0,0,0,255)'
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (p[`${x}:${y}`]) {
        ctx.fillRect(x * 5, y * 5, 5, 5);
      }
    }
  }

  const fs = require('fs')
  const out = fs.createWriteStream(__dirname + '/output/day10output.png')
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file was created.'))
}

const run = () => {
  const program = readArrayFromFile("./input/day11.txt", ",");
  const computer = initComputer(program, [], []);

  const painted = paintRegistrationNumber(computer);
  console.log(`Paint count: ${getCoords(painted).length}`);

  // drawOutputText(painted);
  drawOutputImage(painted);
}

module.exports = { run }