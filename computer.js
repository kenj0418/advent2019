var readlineSync = require('readline-sync');

const add = (op1, op2) => {
  return op1 + op2;
}

const mult = (op1, op2) => {
  return op1 * op2;
}

const getParam = (paramMode, computer, param) => {
  switch (paramMode) {
    case 0: return computer.memory[param]; // position mode
    case 1: return param; // immediate mode
    default: throw new Error(`Invalid Parameter Mode: ${paramMode}`);
  }
}

const putParam = (paramMode, computer, param, value) => {
  switch (paramMode) {
    case 0: // position mode
      computer.memory[param] = value;
      return;
    case 1: // immediate mode
      throw new Error("Immediate Mode Not Supported for Write Parameters");
    default: throw new Error(`Invalid Parameter Mode: ${paramMode}`);
  }
}

const binaryOp = (computer, paramModes, operation) => {
  const mem = computer.memory;
  const param1 = mem[computer.PC + 1]
  const param2 = mem[computer.PC + 2]
  const param3 = mem[computer.PC + 3]
  const op1 = getParam(paramModes[1], computer, param1);
  const op2 = getParam(paramModes[2], computer, param2);
  const result = operation(op1, op2);

  putParam(paramModes[3], computer, param3, result);
  computer.PC += 4;
}

const condJump = (computer, paramModes, targetValue) => {
  const mem = computer.memory;
  const param1 = mem[computer.PC + 1]
  const param2 = mem[computer.PC + 2]
  const op1 = getParam(paramModes[1], computer, param1);
  const op2 = getParam(paramModes[2], computer, param2);

  // console.log(`targetValue: ${targetValue}, op1: ${op1}`);
  if ((targetValue && op1) || (!targetValue && !op1)) {
    computer.PC = op2;
  } else {
    computer.PC += 3;
  }
}

const jumpIfTrue = (computer, paramModes) => {
  condJump(computer, paramModes, true);
}

const jumpIfFalse = (computer, paramModes) => {
  condJump(computer, paramModes, false);
}

const compareOp = (computer, paramModes, comparison) => {
  const mem = computer.memory;
  const param1 = mem[computer.PC + 1]
  const param2 = mem[computer.PC + 2]
  const param3 = mem[computer.PC + 3]
  const op1 = getParam(paramModes[1], computer, param1);
  const op2 = getParam(paramModes[2], computer, param2);

  // console.log(`op1: ${op1}, op2: ${op2}`);

  const result = comparison(op1, op2) ? 1 : 0;
  putParam(paramModes[3], computer, param3, result);
  computer.PC += 4;
}

const equalOp = (op1, op2) => {
  return op1 == op2;
}

const lessThanOp = (op1, op2) => {
  return op1 < op2;
}


const stop = (computer) => {
  computer.STOP = true;
}


const consoleIn = () => {
  return parseInt(readlineSync.question("Enter value: "));
}

const write = (computer, paramModes) => {
  const param1 = computer.memory[computer.PC + 1]
  const value = getParam(paramModes[1], computer, param1);

  if (computer.outputs) {
    computer.outputs.push(value);
  } else {
    console.log(`OUTPUT: ${value}`);
  }

  computer.PC += 2;
}

const read = (computer, paramModes) => {
  let value;
  if (computer.inputs) {
    value = computer.inputs.shift();
  } else {
    value = parseInt(readlineSync.question("Enter value: "));
  }
  const param1 = computer.memory[computer.PC + 1]

  putParam(paramModes[1], computer, param1, value);
  computer.PC += 2;
}

const parseInstruction = (instr) => {
  return {
    opCode: instr % 100,
    paramModes : {
      1: Math.floor(instr / 100) % 10,
      2: Math.floor(instr / 1000) % 10,
      3: Math.floor(instr / 10000)
    }
  };
}

const step = (computer) => {
  const instr = parseInstruction(computer.memory[computer.PC]);
  // console.log(computer.PC, computer.memory[computer.PC], instr);

  switch (instr.opCode) {
    case 1:
      binaryOp(computer, instr.paramModes, add);
      break;

    case 2: 
      binaryOp(computer, instr.paramModes, mult);
      break;

    case 3:
      read(computer, instr.paramModes);
      break;

    case 4:
      write(computer, instr.paramModes);
      break;

    case 5:
      jumpIfTrue(computer, instr.paramModes);
      break;

    case 6:
      jumpIfFalse(computer, instr.paramModes);
      break;

    case 7: 
      compareOp(computer, instr.paramModes, lessThanOp);
      break;

    case 8: 
      compareOp(computer, instr.paramModes, equalOp);
      break;
  
    case 99:
      stop(computer);
      break;

    default: throw new Error(`INVALID OPCODE ${instr.opCode}`);
  }
}

const initComputer = (initialMemory, inputs = null, outputs = null) => {
  return {
    PC: 0,
    STOP: false,
    memory: JSON.parse(JSON.stringify(initialMemory)),

    inputs,
    outputs
  }
}

const runUntilOutputOrHalt = (computer) => {
  while (!computer.STOP && (!computer.outputs || computer.outputs.length === 0)) {
    step(computer);
  }

  return computer.outputs ? computer.outputs.length : 0
}

const runUntilHalt = (computer) => {
  while (!computer.STOP) {
    step(computer);
  }
}

const executeProgram = (initialMemory, inputs = null, outputs = null) => {
  let computer = initComputer(initialMemory, inputs, outputs);
  runUntilHalt(computer);
  return computer;
}

module.exports = {executeProgram, initComputer, runUntilHalt, runUntilOutputOrHalt}