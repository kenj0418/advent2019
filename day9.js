const {readArrayFromFile} = require("./lib");
const {executeProgram} = require("./computer");

const run = () => {
  const program = readArrayFromFile("./day9.txt", ",");
  let output = []
  const computer = executeProgram(program, undefined, output);
  // console.log(computer);
  console.log(output);
}

module.exports = { run }