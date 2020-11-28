class Computer {
  constructor(initialMemory) {
    this.getInput = () => {
      throw new Error("Input function not set");
    }
    this.outputs = []

    this.PC = 0;
    this.STOP = false;
    this.RBASE = 0;
    this.memory = JSON.parse(JSON.stringify(initialMemory));
  }


  add (op1, op2) {
    return op1 + op2;
  }

  mult (op1, op2) {
    return op1 * op2;
  }

  binaryOp(paramModes, operation) {
    const mem = this.memory;
    const param1 = mem[this.PC + 1]
    const param2 = mem[this.PC + 2]
    const param3 = mem[this.PC + 3]
    const op1 = this.getParam(paramModes[1], param1);
    const op2 = this.getParam(paramModes[2], param2);
    const result = operation(op1, op2);
  
    this.putParam(paramModes[3], param3, result);
    this.PC += 4;
  }

  getParam (paramMode, param) {
    switch (paramMode) {
      case 0: return this.memory[param]; // position mode
      case 1: return param; // immediate mode
      case 2: 
        return this.memory[this.RBASE + param]; // relative mode
      default: throw new Error(`Invalid Parameter Mode: ${paramMode}`);
    }
  }
  
  putParam (paramMode, param, value) {
    switch (paramMode) {
      case 0: // position mode
      this.memory[param] = value;
        return;
      case 1: // immediate mode
        throw new Error("Immediate Mode Not Supported for Write Parameters");
      case 2: // relative mode
        this.memory[this.RBASE + param] = value;
        return;
      default: throw new Error(`Invalid Parameter Mode: ${paramMode}`);
    }
  }
  
  condJump (paramModes, targetValue) {
    const mem = this.memory;
    const param1 = mem[this.PC + 1]
    const param2 = mem[this.PC + 2]
    const op1 = this.getParam(paramModes[1], param1);
    const op2 = this.getParam(paramModes[2], param2);
  
    // console.log(`targetValue: ${targetValue}, op1: ${op1}`);
    if ((targetValue && op1) || (!targetValue && !op1)) {
      this.PC = op2;
    } else {
      this.PC += 3;
    }
  }
  
  jumpIfTrue(paramModes) {
    this.condJump(paramModes, true);
  }
  
  jumpIfFalse(paramModes) {
    this.condJump(paramModes, false);
  }
  
  compareOp(paramModes, comparison) {
    const mem = this.memory;
    const param1 = mem[this.PC + 1]
    const param2 = mem[this.PC + 2]
    const param3 = mem[this.PC + 3]
    const op1 = this.getParam(paramModes[1], param1);
    const op2 = this.getParam(paramModes[2], param2);
  
    // console.log(`op1: ${op1}, op2: ${op2}`);
  
    const result = comparison(op1, op2) ? 1 : 0;
    this.putParam(paramModes[3], param3, result);
    this.PC += 4;
  }
  
  equalOp(op1, op2) {
    return op1 == op2;
  }
  
  lessThanOp(op1, op2) {
    return op1 < op2;
  }
  
  write (paramModes) {
    const param1 = this.memory[this.PC + 1]
    const value = this.getParam(paramModes[1], param1);
  
    if (value == undefined) {
      throw new Error("Undefined output");
    }
  
    this.outputs.push(value);
  
    this.PC += 2;
  }
  
  read(paramModes) {
    const value = this.getInput();
    const param1 = this.memory[this.PC + 1]
  
    this.putParam(paramModes[1], param1, value);
    this.PC += 2;
  }
  
  adustRelativeBase(paramModes) {
    const param1 = this.memory[this.PC + 1]
    const value = this.getParam(paramModes[1], param1);
  
    this.RBASE += value;
    this.PC += 2;
  }

  parseInstruction (instr) {
    return {
      opCode: instr % 100,
      paramModes : {
        1: Math.floor(instr / 100) % 10,
        2: Math.floor(instr / 1000) % 10,
        3: Math.floor(instr / 10000)
      }
    };
  }

  step() {
    const instr = this.parseInstruction(this.memory[this.PC]);
  
    switch (instr.opCode) {
      case 1:
        this.binaryOp(instr.paramModes, this.add);
        break;
  
      case 2: 
        this.binaryOp(instr.paramModes, this.mult);
        break;
  
      case 3:
        this.read(instr.paramModes);
        break;
  
      case 4:
        this.write(instr.paramModes);
        break;
  
      case 5:
        this.jumpIfTrue(instr.paramModes);
        break;
  
      case 6:
        this.jumpIfFalse(instr.paramModes);
        break;
  
      case 7: 
        this.compareOp(instr.paramModes, this.lessThanOp);
        break;
  
      case 8: 
        this.compareOp(instr.paramModes, this.equalOp);
        break;
    
      case 9:
        this.adustRelativeBase(instr.paramModes);
        break;
  
      case 99:
        this.STOP = true;
        break;
  
      default: throw new Error(`INVALID OPCODE ${instr.opCode}`);
    }
  }

  runUntilOutputOrHalt () {
    while (!this.STOP && (this.outputs.length === 0)) {
      this.step();
    }
  }
}

module.exports = Computer;