const {readStringArrayFromFile} = require("./lib");

const getOrbits = () => {
  const orbits = readStringArrayFromFile("./day6.txt", "\n").map((st) => {
    const pair = st.split(")");
    return {
      center: pair[0],
      sat: pair[1]
    }
  });

  return orbits;
}

const generateOrbitGraph = (orbits) => {
  let graph = {}
  orbits.forEach(orbit => {
    if (graph[orbit.center]) {
      graph[orbit.center] = [...graph[orbit.center], orbit.sat];
    } else {
      graph[orbit.center] = [orbit.sat];
    }    
  });

  return graph;
}

const computeOrbitCount = (graph, depth = 0, startAt = "COM") => {
  const sats = graph[startAt];
  if (!sats || !sats.length) {
    return 0;
  }

  let count = 0;
  sats.forEach(sat => {
    count += depth + 1
    count += computeOrbitCount(graph, depth + 1, sat);
  })

  return count;
}

const isParentOf = (graph, parent, target) => {
  const sats = graph[parent];
  if (!sats || !sats.length) {
    return false;
  }
  
  let found = false;
  sats.forEach(sat => {
    if (sat === target) {
      found = true;
    } else if (isParentOf(graph, sat, target)) {
      found = true;
    }
  })

  return found;  
}

const isParentOfBoth = (graph, parent, sat1, sat2) => {
  return isParentOf(graph, parent, sat1) && isParentOf(graph, parent, sat2);
}

const findCommonRoot = (graph, parent, sat1, sat2) => {
  if (!isParentOfBoth(graph, parent, sat1, sat2)) {
    return null;
  }

  const sats = graph[parent];
  if (!sats || !sats.length) {
    return parent;
  }

  let found = null;
  sats.forEach(newParent => {
    const satComm = findCommonRoot(graph, newParent, sat1, sat2);
    if (satComm) {
      found = satComm;
    }
  })

  return found ? found : parent;
}

const levelsDown = (graph, parent, child, depth) => {
  if (parent === child) {
    return depth;
  }

  const sats = graph[parent];
  if (!sats || !sats.length) {
    return -1;
  }

  let found = -1;
  sats.forEach(newParent => {
    const levelsDownForSat = levelsDown(graph, newParent, child, depth + 1);
    if (levelsDownForSat >= 0) {
      found = levelsDownForSat;
    }
  })

  return found;
}

const transfersRequired = (graph, commonRoot, object1, object2) => {
  return levelsDown(graph, commonRoot, object1, 0) + levelsDown(graph, commonRoot, object2, 0) - 2; // -2 since not include YOU or SAT
}

const run = () => {
  const orbits = getOrbits();
  // console.log(orbits);

  const graph = generateOrbitGraph(orbits);
  // console.log(graph);

  const orbitCount = computeOrbitCount(graph);
  console.log(orbitCount);

  const commonRoot = findCommonRoot(graph, "COM", "YOU", "SAN");
  console.log(`Common root: ${commonRoot}`);

  const trans = transfersRequired(graph, commonRoot, "YOU", "SAN");
  console.log(trans);
}

module.exports = { run }