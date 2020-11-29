const {readStringArrayFromFile} = require("./lib");

const parseMaterial = (st) => {
  const parts = st.split(" ");
  return {
    material: parts[1],
    qty: parseInt(parts[0])
  };
}

const parseReaction = (st) => {
  const reactionSides = st.split(" => ");
  const product = parseMaterial(reactionSides[1]);
  const components = reactionSides[0].split(", ").map(parseMaterial);

  return {product, components};
}

const addToInventory = (inv, material, qty) => {
  if (inv[material]) {
    inv[material] += qty;
  } else {
    inv[material] = qty;
  }

  // console.log(`inv[material]:${inv[material]}`);
  return inv[material] >= 0
}

const performReaction = (oldInventory, reaction) => {
  const newInv = JSON.parse(JSON.stringify(oldInventory));
  for (let i = 0; i < reaction.components.length; i++) {
    if (!addToInventory(newInv, reaction.components[i].material, -reaction.components[i].qty)) {
      return null;
    }
  }

  addToInventory(newInv, reaction.product.material, reaction.product.qty);

  // console.log(`trying reaction: ${JSON.stringify(reaction)} (inv was: ${JSON.stringify(oldInventory)}, now ${JSON.stringify(newInv)}`);
  return newInv;
}

const haveInventory = (inv, material, qty) => {
  // console.log(`inv[${material}]:${inv[material]} >= ${qty} is ${inv[material] >= qty}`);
  return inv[material] >= qty;
}

const canMake = (reactions, targetMaterial, targetQty, parentInventory, level = 0) => {
  // console.log(`@${level} Trying to make ${targetQty} of ${targetMaterial} with ${JSON.stringify(parentInventory)}`);
  if (haveInventory(parentInventory, targetMaterial, targetQty)) {
    return true;
  }

  for (let i = 0; i < reactions.length; i++) {
    const newInv = performReaction(parentInventory, reactions[i]);
    if (newInv && canMake(reactions, targetMaterial, targetQty, newInv, level + 1)) {
      return true;
    }
  }

  return false;
}

const findMinimumOreNeeded = (reactions, targetMaterial, targetQty) => {
  let oreUsed = 0;

  while (true) {
    console.log(`Trying with ${oreUsed} ORE`);

    let baseInv = {};
    baseInv["ORE"] = oreUsed;

    if (canMake(reactions, targetMaterial, targetQty, baseInv)) {
      return oreUsed
    }

    oreUsed++;
  }
}


const run = () => {
  const reactions = readStringArrayFromFile("./input/day14.txt", "\n").map(parseReaction);
  // console.log(JSON.stringify(reactions, null, 2));

  const requirements = findMinimumOreNeeded(reactions, "FUEL", 1);

  console.log(`ORE NEEDED: ${requirements}`);
}

module.exports = {run}