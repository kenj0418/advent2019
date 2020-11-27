const {readStringArrayFromFile} = require("./lib");
const lcm = require( 'compute-lcm' );

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
    moons.push(parseMoon(line));
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

const applyGravityPairwise = (moons) => {
  // this was doing it pair by pair
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
  applyGravityPairwise(moons);
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

const getStateValueForCoord = (coord, primeOffset) => {
  return `${coord.x},${coord.y},${coord.z}`;
}

const getStateValueForMoon = (moon, primeOffset) => {
  return `${getStateValueForCoord(moon.position)}>${getStateValueForCoord(moon.velocity)}`;
}

const getStateValueForSystem = (moons) => {
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
  let found = false;
  let i = 0;

  while (!found) {
    i++
    // const stateValue = getStateValueForSystem(moons);
    if (i % 1000000 == 0) {console.log(`@ ${i}`)};
    simulationStep(moons);
    if (i == 8686775) {found = true};
  }
}

const applyGravityOneDimensionPairwise = (m1, m2) => {
  const diff = Math.sign(m1.position - m2.position);

  m1.velocity -= diff;
  m2.velocity += diff;
}

const applyGravityOneDimension = (moons) => {
  for (let m1 = 0; m1 < moons.length; m1++) {
    for (let m2 = m1 + 1; m2 < moons.length; m2++) {
      applyGravityOneDimensionPairwise(moons[m1], moons[m2]);
    }
  }
}

const applyVelocityOneDimension = (moons) => {
  moons.forEach((moon) => {
    moon.position += moon.velocity
  })
}

const simulationStepOneDimension = (moons) => {
  applyGravityOneDimension(moons);
  applyVelocityOneDimension(moons);
}

const getStateOneDimension = (moons) => {
  let state = "";
  moons.forEach((moon) => {
    state += `${moon.position},${moon.velocity}\t`
  })

  return state;
}

const isSame = (s1, s2) => {
  // if s1.length != s2.length return false;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i].position != s2[i].position || s1[i].velocity != s2[i].velocity) {
      return false;
    }
  }

  return true;
}

// const findFirstRepeat = (moons) => {
//   const initialState = getStateOneDimension(moons)
//   console.log(initialState + "  ** INITIAL **");
//   let states = [initialState]

//   while (true) {
//     simulationStepOneDimension(moons);
//     const currState = getStateOneDimension(moons);
//     if (states.indexOf(currState) >= 0) {
//       console.log(currState + "  ** MATCHED **");
//       return states.length
//     }

//     console.log(currState);
//     states.push(currState);
//   }
// }

const findFirstRepeat = (moons) => {
  const initial = JSON.parse(JSON.stringify(moons));
  let i = 1

  while (true) {
    simulationStepOneDimension(moons);
    const currState = getStateOneDimension(moons);
    if (isSame(initial, moons)) {
      return i;
    }

    i++;
  }
}

const run = () => {
  const moonData = readStringArrayFromFile("./input/day12.txt", "\n").filter(st => {return st.length > 0});
  // console.log(moonData);
  const moons = parseMoonData(moonData);
  // console.log(moons);

  // simulate(moons, 1000);
  // console.log(moons);
  // calculateSystemEnergy(moons);

  const startTime = new Date().getTime();
  
  const moonX = moons.map((moon) => {
    return {
      position: moon.position.x,
      velocity: 0
    }
  });

  const moonY = moons.map((moon) => {
    return {
      position: moon.position.y,
      velocity: 0
    }
  });

  const moonZ = moons.map((moon) => {
    return {
      position: moon.position.z,
      velocity: 0
    }
  });

  const repeatX = findFirstRepeat(moonX);
  console.log(`first repeat of X at: ${repeatX}`);

  const repeatY = findFirstRepeat(moonY);
  console.log(`first repeat of Y at: ${repeatY}`);

  const repeatZ = findFirstRepeat(moonZ);
  console.log(`first repeat of Z at: ${repeatZ}`);

  const lcmXYZ = lcm(repeatX, repeatY, repeatZ);
  console.log(`first repeat of all at: ${lcmXYZ}`);

  const endTime = new Date().getTime();
  const durr = Math.round((endTime - startTime) / 1000); // div 1000 for ms->s
  console.log(`${durr} s`);
}

module.exports = { run }