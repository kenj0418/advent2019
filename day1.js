const {sum, readArrayFromFile} = require("./lib");


const fuelRequired = (mass) => {
  if (mass.length) {
    return sum(mass.map(fuelRequired));
  }

  return Math.max(0, Math.floor(mass / 3) - 2);
}

const fuelRequiredWithFuel = (baseMass) => {
  if (baseMass.length) {
    return sum(baseMass.map(fuelRequiredWithFuel));
  }

  let currFuelRequired = fuelRequired(baseMass);
  let totalFuelRequired = 0;
  while (currFuelRequired > 0) {
    totalFuelRequired += currFuelRequired;
    currFuelRequired = fuelRequired(currFuelRequired);
  }
  
  return totalFuelRequired;
}

const run = () => {
  const components = readArrayFromFile("./input/day1.txt", "\n");
  console.log("total: ", fuelRequired(components));
  console.log("total w/recur: ", fuelRequiredWithFuel(components));
}

module.exports = { run };