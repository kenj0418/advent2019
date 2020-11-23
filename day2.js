const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computer");

const run = () => {
  const masterProgram = readArrayFromFile("./day2.txt", ",");
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

  console.log("** END **");
}

module.exports = {run}