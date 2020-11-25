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

const simulateUntilRepeat = (moons) => {
  let states = [];
  let found = false;

  while (!found) {
    const currState = JSON.stringify(moons);
    const firstMatch = states.indexOf(currState);
    if (firstMatch >= 0) {
      found = true;
      console.log(`REPEATING ${firstMatch} == ${states.length}`);
    } else {
      states.push(currState);
      if (states.length % 1000 == 0) {console.log(`@ ${states.length}`)};
      simulationStep(moons);
    }
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

  simulateUntilRepeat(moons);
}

module.exports = { run }