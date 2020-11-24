const fs = require("fs");

const sum = (arr) => {
  return arr.reduce((tot, curr) => { return (tot + curr)}, 0);
}

const readStringArrayFromFile = (filename, delim) => {
  return fs.readFileSync(filename).toString().split(delim);
}

const readArrayFromFile = (filename, delim) => {
  return readStringArrayFromFile(filename, delim).map((st) => {return parseInt(st)});
}

const readListsFromFile = (filename) => {
  const parseLine = (line) => {
    return line.split(",");
  }

  const lines = fs.readFileSync(filename).toString().split("\n");
  return lines.map(parseLine);
}

module.exports = { sum, readArrayFromFile, readStringArrayFromFile, readListsFromFile}