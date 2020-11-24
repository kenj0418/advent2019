const {readStringArrayFromFile} = require("./lib");

const getMaxX = (map) => {
  return map[0].length - 1;
}

const getMaxY = (map) => {
  return map.length - 1 ;
}

const isOnMap = (x, y, maxX, maxY) => {
  // console.log(`x:${x}, y:${y}, maxX:${maxX}, maxY:${maxY}`);
  return x >= 0 && y >= 0 && x <= maxX && y <= maxY;
}

function gcd(paramA, paramB) {
  let absA = Math.abs(paramA);
  let absB = Math.abs(paramB);
  let a = (absA > absB) ? absA : absB;
  let b = (absA > absB) ? absB : absA;

  while (true) {
    if (b == 0) return a;
    a %= b;

    if (a == 0) return b;
    b %= a;
  }
}

const isValidStep = (x, y) => {
  if (x == 0) {
    return Math.abs(y) == 1;
  } else if (y == 0) {
    return Math.abs(x) == 1;
  } else {
    return gcd(x,y) == 1;
  }
}

const clockwiseAngle = (c) => {
  let angleInRadians = Math.atan2(c.x, c.y);
  return Math.PI / 2 - angleInRadians;
}

const clockwise = (a, b) => {
  return clockwiseAngle(a) - clockwiseAngle(b);
}

const getDirections = (map) => {
  const maxX = getMaxX(map);
  const maxY = getMaxY(map);
  let directions = []

  for (let x = -maxX; x <= maxY; x++) {
    for (let y = -maxY; y <= maxY; y++) {
      if (isValidStep(x, y)) {
        directions.push({x, y});
      }
    }
  }

  directions.sort(clockwise);
  return directions;
}

const getAsteroidsInDirection = (map, x, y, dir) => {
  const maxX = getMaxX(map);
  const maxY = getMaxY(map);

  let currX = x + dir.x;
  let currY = y + dir.y;

  const currLos = []
  while (isOnMap(currX, currY, maxX, maxY)) {
    if (hasAsteroid(map, currX, currY)) {
      currLos.push({x: currX, y: currY});
    }
    currX += dir.x;
    currY += dir.y;
  }

  return currLos;
}


const getLinesOfSight = (map, x, y) => {
  const maxX = getMaxX(map);
  const maxY = getMaxY(map);
  let losList = []

  const directions = getDirections(map);
  directions.forEach((dir) => {
    // console.log(`xStep:${dir.x}, yStep:${dir.y}`);
    const currLos = getAsteroidsInDirection(map, x, y, dir);
    if (currLos.length) {
      losList.push(currLos);
    }
  });

  return losList;
}

const hasAsteroid = (map, x, y) => {
  return map[y][x] === "#";
}

const asteroidOnLineOfSight = (map, los) => {
  return los.find((point) => {return hasAsteroid(map, point.x, point.y)});
}

const findSpotCount = (map, x, y) => {
  const linesOfSight = getLinesOfSight(map, x, y);
  const spotted = linesOfSight.filter((los) => {return asteroidOnLineOfSight(map, los)});
  // console.log(`SPOTTED FROM ${x},${y}`);
  // console.log(spotted);
  return spotted.length;
}

const findBestLocationChart = (map) => {
  let chart = "";
  for (let y = 0; y <= getMaxY(map); y++) {
    for (let x = 0; x <= getMaxX(map); x++) {
      if (hasAsteroid(map, x, y)) {
        const currSpotCount = findSpotCount(map, x, y);
        if (currSpotCount > 9) {
          console.log(`OVERFLOW ${currSpotCount} @ ${x},${y}`);
          chart += "@"
        } else {
          chart += `${currSpotCount}`
        }
      } else {
        chart += "."
      }
    }
    chart += "\n"
  }

  return chart;
}

const findBestLocation = (map) => {
  let maxSpotCount = 0;
  let maxSpotLocation = null;

  for (let x = 0; x <= getMaxX(map); x++) {
    for (let y = 0; y <= getMaxY(map); y++) {
      if (hasAsteroid(map, x, y)) {
        const currSpotCount = findSpotCount(map, x, y);
        if (currSpotCount > maxSpotCount) {
          maxSpotCount = currSpotCount;
          maxSpotLocation = {x, y};
        }
      }
    }
  }

  console.log(`MAX: ${maxSpotCount} spotted @ ${maxSpotLocation.x},${maxSpotLocation.y}`);
  return maxSpotLocation;
}

const dirToIndex = (dir) => { return `${dir.x}:${dir.y}` }

const getTargets = (map, x, y) => {
  const directions = getDirections(map);
  let targets = {}
  directions.forEach((dir) => {
    const inDir = getAsteroidsInDirection(map, x, y, dir);
    if (inDir.length) {
      targets[dirToIndex(dir)] = inDir;
    }
  })

  return targets;
}

const pewpew = (map, x, y) => {
  const directions = getDirections(map);
  let targets = getTargets(map, x, y);
  let emptyCycle = false
  let pewCount = 0;

  while (!emptyCycle) {
    emptyCycle = true;
    directions.forEach((dir) => {
      if (targets[dirToIndex(dir)]) {
        emptyCycle = false;
        pewCount++;
        const pew = targets[dirToIndex(dir)].shift()

        if (pewCount == 200) {
          console.log(`PEW #${pewCount}: ${pew.x},${pew.y}  VALUE: ${pew.x * 100 + pew.y}`)
        }

        if (targets[dirToIndex(dir)].length == 0) {
          delete targets[dirToIndex(dir)];
        }
      }
    })
  }
}


const run = () => {
  const map = readStringArrayFromFile("./input/day10.txt", "\n").filter((st) => {return st.length > 0});

  // console.log(map);
  console.log(`SIZE: ${getMaxX(map) + 1} x ${getMaxY(map) + 1}`);

  // const directions = getDirections(map);
  // console.log(directions);

  // const losList = getLinesOfSight(map, 0, 2);
  // console.log(losList);
  // const spotCount = findSpotCount(map, 0, 2);
  // console.log(spotCount);


  // const chart = findBestLocationChart(map);
  // console.log(chart);

  let {x, y} = findBestLocation(map);
  pewpew(map, x, y);
}

module.exports = {run}