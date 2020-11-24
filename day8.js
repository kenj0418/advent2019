const {readStringArrayFromFile} = require("./lib");

const splitIntoLayers = (data, width, height) => {
  const layerSize = width * height;
  let layers = []
  let pos = 0;
  while (pos < data.length) {
    const chunk = data.slice(pos, pos + layerSize);
    layers.push(chunk);
    pos += layerSize;
  }

  return layers;
}

const digCount = (layer, digRegExp) => {
  const st = layer.join();
  return (st.match(digRegExp) || []).length;
}

const findLayer = (layers) => {
  let minCount = 9999999;
  let minLayer = -1;

  for (let i = 0; i < layers.length; i++) {
    const zeroCount = digCount(layers[i], /0/g);
    if (zeroCount < minCount) {
      minCount = zeroCount;
      minLayer = i;
    }
  }

  return layers[minLayer];
}

const evaluateLayer = (layer) => {
  const result = digCount(layer, /1/g) * digCount(layer, /2/g);
  console.log(`Result= ${result}`);
}

const applyLayer = (base, layer) => {
  for (let i = 0; i < layer.length; i++) {
    const pixel = layer[i];

    if (pixel == 2) {
      // do nothing
    } else {
      base[i] = layer[i];
    }
  }
}

const combineLayers = (layers) => {
  const base = layers[layers.length - 1];

  for (let i = layers.length - 2; i >= 0; i--) {
     applyLayer(base, layers[i]);
  }

  return base;
}

const run = () => {
  const data = readStringArrayFromFile("./day8.txt", "");
  const width = 25;
  const height = 6;
  const layers = splitIntoLayers(data, width, height);
  console.log(`len: ${data.length} ( ${width} x ${height} x ${layers.length} )`);

  // const targetLayer = findLayer(layers);
  // evaluateLayer(targetLayer);

  const combined = combineLayers(layers);
  const st = combined.join("").replace(/2/g, "?").replace(/1/g, "X").replace(/0/g, " ");
  // console.log(st);
  for (let i = 0; i < height; i++) {
    console.log(st.slice(i * width, (i+1) * width));
  }
}

module.exports = { run }