const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computerfunc");

const run = () => {
  const program = readArrayFromFile("./input/day9.txt", ",");
  let output = []
  const computer = executeProgram(program, undefined, output);
  // console.log(computer);
  console.log(output);
}

module.exports = { run }