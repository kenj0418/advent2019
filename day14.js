const {readStringArrayFromFile, permutator} = require("./lib");

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

const arrangeReactions = (reactions) => {
  let arranged = {};

  reactions.forEach((reaction) => {
    const prod = reaction.product.material;
    if (arranged[prod]) {
      arranged[prod].push(reaction);
    } else {
      arranged[prod] = [reaction];
    }
  });

  return arranged;
}

const useInventory = (inventory, needMaterial, needQty, level) => {
  if (!inventory[needMaterial]) {
    output(level, `No ${needMaterial} in inventory`);
    return needQty
  } else if (inventory[needMaterial] < needQty) {
    const stillNeed = needQty - have;
    delete inventory[needMaterial];
    output(level, `Used all ${needMaterial} in inventory, still need ${stillNeed}`);
    return stillNeed;
  } else {
    inventory[needMaterial] -= needQty;
    output(level, `Had enough ${needMaterial} in inventory, still have ${inventory[needMaterial]} left`);
    return 0;
  }
}

const combineInventory = (masterInv, addInv) => {
  Object.getOwnPropertyNames(addInv).forEach((material) => {
    if (masterInv[material]) {
      masterInv[material] += addInv[material];
    } else {
      masterInv[material] = addInv[material];
    }
  })

  console.log("INV TEST:" + JSON.stringify(addInv));
}

const output = (level, st) => {
  if (level <= 0) {
    console.log(st);
  } else {
    output(level - 1, "  " + st);
  }
}

// const calculateMinimumOreReactions = (reactions, targetMaterial, targetQty, level) => {
//   output(level, `Looking for ${targetQty} ${targetMaterial}`);

//   if (targetMaterial == "ORE") {
//     output(level, `BASE ORE: ${targetQty}`);
//     return {oreNeeded: targetQty, reactions: [], left:{}}
//   }

//   const relevant = reactions[targetMaterial];
//   if (!relevant || relevant.length == 0) {
//     throw new Error(`Unable to produce ${targetMaterial}`);
//   }

//   let minOreReq = null
//   let minOreReactions = null
//   let minInv = null;

//   relevant.forEach((react) => {
//     let minTotal = 0;
//     let minReactions = [];
//     let inventory = {}

    

//     // trying every order since sometimes there will be leftovers that reduce the need to make more
//     const componentPermutations = permutator(react.components);
//     componentPermutations.forEach((components) => {
//       output(level, `trying ${components.map((comp)=>{return comp.material})}`);
//       components.forEach((component) => {
//         const componentQtyNeeded = useInventory(inventory, component.material, component.qty, level)
//         if (componentQtyNeeded) {
//           const minReact = calculateMinimumOreReactions(reactions, component.material, componentQtyNeeded, level + 1);
//           minTotal += minReact.oreNeeded;
//           minReactions.push(react);
//           combineInventory(inventory, minReact.left);
//         }
//       });
//     });

//     if (minOreReq == null || minTotal < minOreReq) {
//       minOreReq = minTotal;
//       minOreReactions = JSON.parse(JSON.stringify(minReactions));
//       minInv = JSON.parse(JSON.stringify(inventory));
//     }
//   })

//   output(level, `Need ${minOreReq} for ${targetQty} of ${targetMaterial}`);
//   output(level, `Left: ${JSON.stringify(minInv)}`);
//   return {
//     oreNeeded: minOreReq,
//     reactions: minOreReactions,
//     left: minInv,
//   }
// }

const performReaction = (oldInventory, reaction) => {
  // todo
}

const getValidReactions = (reactions, inv) => {
  return reactions.filter((reaction) => {
    const missingComponent = reaction.components.find((component) => {
      return !haveInventory(inv, component.material, component.qty);
    });

    return !missingComponent;
  });
}

const canMake = (reactions, targetMaterial, targetQty, parentInventory) => {
  if (haveInventory(parentInventory, targetMaterial, targetQty) {
    return true;
  }

  let inv = JSON.parse(JSON.stringify(parentInventory));
  const possibleReactons = getValidReactions(reactions, inventory);

  //todo try each then recurse
  // return false if none succeed
  return false;

}

const findMinimumOreNeeded = (reactions, targetMaterial, targetQty) => {
  let oreUsed = 0;

  while (true) {
    if (canMake(reactions, targetMaterial, targetQty, [{material: "ORE", qty: oreUsed}])) {
      return oreUsed
    }

    oreUsed++;
  }
}


const run = () => {
  const reactions = readStringArrayFromFile("./input/day14.txt", "\n").map(parseReaction);
  // console.log(JSON.stringify(reactions, null, 2));
  // const reactionsByProduct = arrangeReactions(reactions);
  // console.log(JSON.stringify(reactionsByProduct, null, 2));

  const requirements = findMinimumOreNeeded(reactions, "FUEL", 1);


  // const minimumOreReactions = calculateMinimumOreReactions(reactionsByProduct, "FUEL", 1, 0);
  // console.log(JSON.stringify(minimumOreReactions, null, 2));
  console.log(`ORE NEEDED ${minimumOreReactions.oreNeeded}`);
}

module.exports = {run}