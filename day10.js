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

const getLinesOfSight = (map, x, y) => {
  const maxX = getMaxX(map);
  const maxY = getMaxY(map);
  let losList = []

  for (let xStep = -maxX; xStep <= maxY; xStep++) {
    for (let yStep = -maxY; yStep <= maxY; yStep++) {
      if (!isValidStep(xStep, yStep)) {
        continue;
      }

      // console.log(`xStep:${xStep}, yStep:${yStep}`);
      let currX = x + xStep;
      let currY = y + yStep;

      const currLos = []
      while (isOnMap(currX, currY, maxX, maxY)) {
        currLos.push({x: currX, y: currY});
        currX += xStep;
        currY += yStep;
      }

      if (currLos.length) {
        losList.push(currLos);
      }
    }
  }

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
}

const run = () => {
  const map = readStringArrayFromFile("./day10.txt", "\n").filter((st) => {return st.length > 0});

  // console.log(map);
  console.log(`SIZE: ${getMaxX(map) + 1} x ${getMaxY(map) + 1}`);

  // const losList = getLinesOfSight(map, 0, 2);
  // console.log(losList);
  // const spotCount = findSpotCount(map, 0, 2);
  // console.log(spotCount);


  // const chart = findBestLocationChart(map);
  // console.log(chart);

  findBestLocation(map);
}

module.exports = {run}