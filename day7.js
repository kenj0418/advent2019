const {readArrayFromFile} = require("./lib");
const {executeProgram, initComputer, runUntilOutputOrHalt} = require("./computer");
const computer = require("./computer");

const executeAmplifier = (initialProgram, phaseSetting, input) => {
  let inputs = [phaseSetting, input];
  let outputs = [];

  const program = JSON.parse(JSON.stringify(initialProgram));
  executeProgram(program, inputs, outputs);

  return outputs[0];
}

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}

const executeWithSetting = (initialProgram, setting) => {
  let currValue = 0;
  for (let i = 0; i < setting.length; i++) {
    const phaseSetting = setting[i];
    currValue = executeAmplifier(initialProgram, phaseSetting, currValue);
  }
  
  return currValue;
}

const findLargestOnePass = (initialProgram) => {
  const permutations = permutator([0, 1, 2, 3, 4]);
  let maxSettings = null;
  let maxValue = -1;

  permutations.forEach(setting => {
    const value = executeWithSetting(initialProgram, setting);
    // console.log(`${setting} : ${value}`);
    if (value > maxValue) {
      maxValue = value;
      maxSettings = JSON.parse(JSON.stringify(setting));
    }
  });

  console.log(`MAX SETTING: ${maxSettings}`);
  console.log(`MAX VALUE: ${maxValue}`);
}


const executeWithSettingMultiPass = (initialProgram, setting) => {
  const phaseSettingOffset = 5;
  let computers = []

  let currValue = 0;

  // initialize computers
  for (let i = 0; i < setting.length; i++) {
    let computer = initComputer(initialProgram, [], []);
    const phaseSetting = setting[i] + phaseSettingOffset;
    computer.inputs.push(phaseSetting)
    computers.push(computer);
  }

  while (!computers[setting.length - 1].STOP) {
    for (let i = 0; i < setting.length; i++) {
      computers[i].inputs.push(currValue)
      // console.log(`computers[${i}].inputs: ${computers[i].inputs}`);
      if (!runUntilOutputOrHalt(computers[i])) {
        return currValue;
        // throw new Error("Expected output not received");
      }
      // console.log(`computers[${i}].outputs: ${computers[i].outputs}`);
      currValue = computers[i].outputs.shift();
    }
  }

  // console.log(`setting: ${setting}, currValue: ${currValue}`)

  return currValue;
}

const findLargestMultiPass = (initialProgram) => {
  // https://media.giphy.com/media/lKPFZ1nPKW8c8/giphy.gif
  const permutations = permutator([0, 1, 2, 3, 4]);
  let maxSettings = null;
  let maxValue = -1;

  permutations.forEach(setting => {
    const value = executeWithSettingMultiPass(initialProgram, setting);
    if (value > maxValue) {
      maxValue = value;
      maxSettings = JSON.parse(JSON.stringify(setting));
    }
  })

  console.log(`MULTIPASS MAX SETTING: ${maxSettings}`);
  console.log(`MULTIPASS MAX VALUE: ${maxValue}`);
}

const run = () => {
  const initialProgram = readArrayFromFile("./day7.txt", ",");
  findLargestOnePass(initialProgram);
  findLargestMultiPass(initialProgram);
}

module.exports = { run }