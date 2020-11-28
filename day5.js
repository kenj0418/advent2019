const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computerfunc");

const run = () => {
  const program = readArrayFromFile("./input/day5.txt", ",");
  const computer = executeProgram(program);
  // console.log(computer);
}

module.exports = { run }