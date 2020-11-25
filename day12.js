const {readStringArrayFromFile} = require("./lib");

const parseMoon = (line) => {
  const cleanedLine = line.replace(/[ xyz=\<\>]/g, "")
  const coords = cleanedLine.split(",");
  
  let x = parseInt(coords[0]);
  let y = parseInt(coords[1]);
  let z = parseInt(coords[2]);

  return {
    position: {x, y, z},
    velocity: {x:0, y:0, z:0}
  };
}

const parseMoonData = (data) => {
  let moons = [];
  data.forEach((line) => {
    if (line.length) {
      moons.push(parseMoon(line));
    }
  });

  return moons;
}

const applyGravityToPair = (m1, m2) => {
  const xDiff = Math.sign(m1.position.x - m2.position.x);
  const yDiff = Math.sign(m1.position.y - m2.position.y);
  const zDiff = Math.sign(m1.position.z - m2.position.z);

  m1.velocity.x -= xDiff;
  m2.velocity.x += xDiff;

  m1.velocity.y -= yDiff;
  m2.velocity.y += yDiff;

  m1.velocity.z -= zDiff;
  m2.velocity.z += zDiff;
}

const applyGravity = (moons) => {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
        applyGravityToPair(moons[i], moons[j]);
    }
  }
}

const applyVelocity = (moons) => {
  moons.forEach((m) => {
    m.position.x += m.velocity.x;
    m.position.y += m.velocity.y;
    m.position.z += m.velocity.z;
  });
}

const simulationStep = (moons) => {
  applyGravity(moons);
  applyVelocity(moons);
}

const simulate = (moons, steps) => {
  for (let i = 0; i < steps; i++) {
    simulationStep(moons);
  }
}

const calculateEnergy = (coord) => {
  return Math.abs(coord.x) + Math.abs(coord.y) + Math.abs(coord.z);
}

const calculateMoonEnergy = (moon) => {
  const pe = calculateEnergy(moon.position);
  const ke = calculateEnergy(moon.velocity);

  return pe * ke;
}

const calculateSystemEnergy = (moons) => {
  let totalSystemEnergy = 0;

  moons.forEach((moon) => {
    totalSystemEnergy += calculateMoonEnergy(moon);
  });

  console.log(`TOTAL ENERGY: ${totalSystemEnergy}`);
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199]; 

const getStateValueForCoord = (coord, primeOffset) => {
  // return primes[primeOffset] ^ coord.x * primes[primeOffset + 1] ^ coord.y * primes[primeOffset + 2] ^ coord.z;
  return `${coord.x},${coord.y},${coord.z}`;
}

const getStateValueForMoon = (moon, primeOffset) => {
  // return getStateValueForCoord(moon.position, primeOffset) * getStateValueForCoord(moon.velocity, primeOffset + 3);
  return `${getStateValueForCoord(moon.position)}>${getStateValueForCoord(moon.velocity)}`;
}

const getStateValueForSystem = (moons) => {
  // let value = 1;
  // for (let i = 0; i < moons.length; i++) {
  //   value *= getStateValueForMoon(moons[i], i * 6);
  // }  
  let value = ""
  for (let i = 0; i < moons.length; i++) {
    value += getStateValueForMoon(moons[i]);
    value += ":"
  }  
  return value;
}

const simulateUntilRepeat = (moons) => {
  let states = [];
  let found = false;
  let i = 0;

  while (!found) {
    i++
    if (i % 1000000 == 0) {console.log(`@ ${i}`)};
    const stateValue = getStateValueForSystem(moons);
    // console.log(`stateValue: ${stateValue}`);
    if (states[stateValue]) {
      found = true;
      console.log(`REPEATING ${states[stateValue]} == ${i}`);
    } else {
      states[stateValue] = i;
      simulationStep(moons);
    }
  }
}

const simulateUntilRepeatSpeedEstimate = (moons) => {
  let states = [];
  let found = false;
  let i = 0;

  while (!found) {
    i++
    if (i % 1000000 == 0) {console.log(`@ ${i}`)};
    simulationStep(moons);
    if (i == 46867749) {found = true};
  }
}

const run = () => {
  const moonData = readStringArrayFromFile("./input/day12.txt", "\n");
  // console.log(moonData);
  const moons = parseMoonData(moonData);
  // console.log(moons);

  // simulate(moons, 1000);
  // console.log(moons);
  // calculateSystemEnergy(moons);

  const startTime = new Date().getTime();
  // simulateUntilRepeat(moons);
  simulateUntilRepeatSpeedEstimate(moons);
  const endTime = new Date().getTime();
  const durr = Math.round((endTime - startTime) / 1000) * 100; // div 1000 for ms->s mult 100 since stopping at 1% done
  console.log(`${durr} s   (${Math.round(durr/60)} min)`);
}

module.exports = { run }