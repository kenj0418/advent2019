const {readArrayFromFile} = require("./lib");
const {initComputer, runUntilOutputOrHalt} = require("./computer");
// const { createCanvas } = require('canvas')

const addToScreen = (screen, x, y, tileId) => {
  // console.log(`${x}:${y} = ${tileId}`);
  screen[`${x}:${y}`] = tileId;
}

const getNextValue = (computer) => {
  if (!computer.outputs.length) {
    runUntilOutputOrHalt(computer);
  }

  return computer.outputs.shift();
}

const generateScreen = (computer) => {
  let screen = {};

  while (!computer.STOP) {
    const x = getNextValue(computer);
    const y = getNextValue(computer);
    const tileId = getNextValue(computer);

    addToScreen(screen, x, y, tileId);    
  }

  return screen;
}

const outputBlockCount = (screen) => {
  return Object.getOwnPropertyNames(screen)
    .map((index) => {return screen[index]})
    .filter((tileId) => {return tileId == 2})
    .length;
}

const getMaxCoord = (screen, axis) => {
  const values = Object.getOwnPropertyNames(screen)
    .map((index) => {
      const axisValues = index.split(":");
      const value = parseInt(axisValues[axis])
      return value ? value : 0
    })

  return Math.max(...values);
}

const drawChar = (tileId) => {
  switch (tileId) {
    case 0: return " "; // 0 is an empty tile. No game object appears in this tile
    case 1: return "█"; // 1 is a wall tile. Walls are indestructible barriers.
    case 2: return "▤"; // 2 is a block tile. Blocks can be broken by the ball.
    case 3: return "_"; // 3 is a horizontal paddle tile. The paddle is indestructible.
    case 4: return "●"; // 4 is a ball tile. The ball moves diagonally and bounces off objects.
    default: return "?";
  }
}

const drawScreen = (screen) => {
  const maxX = getMaxCoord(screen, 0);
  const maxY = getMaxCoord(screen, 1);

  let screenText = "";
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      screenText += drawChar(screen[`${x}:${y}`]);
    }
    screenText += "\n";
  }

  return screenText;
}

const run = () => {
  let program = readArrayFromFile("./input/day13.txt", ",");
  // program[0] = 2; // free-play

  const computer = initComputer(program, [], []);

  const screen = generateScreen(computer);
  const blockCount = outputBlockCount(screen);
  console.log(drawScreen(screen));
  console.log(`Block Count: ${blockCount}`);  


}

module.exports = {run};