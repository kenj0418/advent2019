const fs = require("fs");

const sum = (arr) => {
  return arr.reduce((tot, curr) => { return (tot + curr)}, 0);
}

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
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

module.exports = { sum, permutator, readArrayFromFile, readStringArrayFromFile, readListsFromFile }