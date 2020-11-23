const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computer");

const run = () => {
  const program = readArrayFromFile("./day5.txt", ",");
  const computer = executeProgram(program);
  // console.log(computer);
}

module.exports = { run }