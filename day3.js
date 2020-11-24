const {readListsFromFile} = require("./lib");

const DIRECTIONS = {
  U: { x: 0, y: 1},
  D: { x: 0, y: -1},
  L: { x: -1, y: 0},
  R: { x: 1, y: 0}
};

const computePath = (wire) => {
  let currX = 0;
  let currY = 0;
  let steps = 0;

  let path = {};
  path[`${currX}:${currY}`] = steps;

  for (let stepNum = 0; stepNum < wire.length; stepNum++) {
    const step = wire[stepNum];
    const dir = step[0];
    const length = parseInt(step.slice(1));
    const dirX = DIRECTIONS[dir].x;
    const dirY = DIRECTIONS[dir].y;

    for (i = 0; i < length; i++) {
      currX += dirX;
      currY += dirY;
      steps++;
      if (!path[`${currX}:${currY}`]) {
        path[`${currX}:${currY}`] = steps;
      }
    }
  }

  return path;
}

const intersection = (path1, path2) => {
  let intersect = new Set();

  for (let elem of Object.getOwnPropertyNames(path1)) {
    if (path2[elem] && elem !== "0:0") {
      intersect.add(elem);
    }
  }

  return Array.from(intersect);
}

const taxiDistance = (point1, point2 = "0:0") => {
  const p1 = point1.split(":");
  const p2 = point2.split(":");

  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

const combinedStepDistance = (path1, path2, point) => {
  return path1[point] + path2[point];
}

const run = () => {
  const wires = readListsFromFile("./input/day3.txt");
  // console.log(wires);

  const paths = wires.map(computePath);
  // console.log(paths);
  const intersections = intersection(paths[0], paths[1]);
  // console.log(intersections);

  const taxiDistances = intersections.map((point) => {return taxiDistance(point)});
  // console.log(taxiDistances);
  console.log(Math.min(...taxiDistances));

  const distances = intersections.map((point) => {return combinedStepDistance(paths[0], paths[1], point)});
  // console.log(distances);
  console.log(Math.min(...distances));
}

module.exports = { run }