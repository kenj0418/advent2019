const {readArrayFromFile} = require("./lib");
const Computer = require("./computer");

// const outputBlockCount = (screen) => {
//   return Object.getOwnPropertyNames(screen)
//     .map((index) => {return screen[index]})
//     .filter((tileId) => {return tileId == 2})
//     .length;
// }

const sleep = (ms) => {
  var start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
}

class BreakoutGame {
  constructor(freeplay) {
    let program = readArrayFromFile("./input/day13.txt", ",");
    if (freeplay) {
      program[0] = 2; // free-play
    }

    this.computer = new Computer(program);
    this.inputCount = 0;
    this.computer.getInput = () => {
      process.stdout.write(`\x1B[4;45HINPUT REQUESTED: ${this.inputCount++}`);
      sleep(10);

      return Math.sign(this.ballX - this.paddleX);
    };
    this.ballX = 5;
    this.paddleX = 5;
    this.screen = {}
    this.score = 0
  }

  getCharForTileId(tileId) {
    switch (tileId) {
      case 0: return " "; // 0 is an empty tile. No game object appears in this tile
      case 1: return "█"; // 1 is a wall tile. Walls are indestructible barriers.
      case 2: return "▤"; // 2 is a block tile. Blocks can be broken by the ball.
      case 3: return "_"; // 3 is a horizontal paddle tile. The paddle is indestructible.
      case 4: return "●"; // 4 is a ball tile. The ball moves diagonally and bounces off objects.
      default: return "?";
    }
  }

  setScore(score) {
    this.score = score;
    process.stdout.write(`\x1B[2;45HScore: ${score}`);
  }

  writeToScreen(x, y, tileId) {
    if (x == undefined || y == undefined || tileId == undefined) {
      return;
    }

    this.screen[`${x}:${y}`] = tileId;
    const tileChar = this.getCharForTileId(tileId);
    process.stdout.write(`\x1B[${y + 1};${x + 1}H${tileChar}`);
    if (tileId == 4) {
      this.ballX = x;
    } else if (tileId == 3) {
      this.paddleX = x;
    }
  }
  
  getNextValue() {
    if (!this.computer.outputs.length) {
      this.computer.runUntilOutputOrHalt();
    }
  
    return this.computer.outputs.shift();
  }

  play() {
    process.stdout.write("\x1B[2J");
    while (!this.computer.STOP) {
      const x = this.getNextValue();
      const y = this.getNextValue();
      const tileId = this.getNextValue();

      if (x == -1 && y == 0) {
        this.setScore(tileId);
      } else {
        this.writeToScreen(x, y, tileId);
      }
    }
  }
}

const run = () => {
  const game = new BreakoutGame(true);
  game.play();

  console.log(`\x1B[26;1HFinal Score: ${game.score}`);

  // const blockCount = outputBlockCount(game.screen);
  // console.log(drawScreen(game.screen));
  // console.log(`Block Count: ${blockCount}`);  

  // const game = playGame(computer);
  // console.log(`Final Score: ${game.score}`);

  // if (outputBlockCount(game.screen)) {
  //   console.log("Some blocks remain");
  //   console.log(drawScreen(game.screen));
  // }
}

module.exports = {run};