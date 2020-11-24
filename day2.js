const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computer");

const findNounVerb = (masterProgram) => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const program = JSON.parse(JSON.stringify(masterProgram));
      program[1] = noun;
      program[2] = verb;
      const computer = executeProgram(program);
      if (computer.memory[0] === 19690720) {
        console.log(`noun=${noun}, verb=${verb}`);
      }
    }
  }
}

const runOne = (masterProgram, noun, verb) => {
  const program = JSON.parse(JSON.stringify(masterProgram));
  program[1] = noun;
  program[2] = verb;
  const computer = executeProgram(program);
  console.log(`RESULT: ${computer.memory[0]}`);
}


const run = () => {
  const masterProgram = readArrayFromFile("./input/day2.txt", ",");
  // runOne(masterProgram, 12, 2);
  findNounVerb(masterProgram);

  console.log("** END **");
}

module.exports = {run}