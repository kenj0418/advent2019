const parseNumberToArray = (st) => {
  return st.split("").map((dig) => {return parseInt(dig)});
}

const isLessEqual = (dig1, dig2) => {
  if (dig1.length != dig2.length) {
    return dig1.length < dig2.length;
  }

  for (let i = 0; i < dig1.length; i++) {
    if (dig1[i] !== dig2[i]) {
      return dig1[i] < dig2[i];
    }
  }

  return true; // equal
}

const next = (dig) => {
  // could short circuit, but for now just incrementing

  const lastDig = dig[dig.length - 1];
  const firstPart = dig.slice(0, dig.length - 1);
  if (lastDig < 9) {
    return [...firstPart, lastDig + 1];
  } else if (dig.length === 1) {
    return [1, 0]; // expanding
  } else {
    return [...next(firstPart), 0];
  } 
}

// const hasAdjacentDigits = (dig) => {
//   if (dig.length < 2) {
//     return false;
//   }

//   for (let i = 1; i < dig.length; ++i) {
//     if (dig[i - 1] == dig[i]) {
//       return true;
//     }
//   }

//   return false;
// }

const hasAdjacentDigitsNotPartOfLargerGroup = (dig) => {
  if (dig.length < 2) {
    return false;
  }

  for (let i = 1; i < dig.length; ++i) {
    if (dig[i - 1] == dig[i]) {
      const notContinuingBefore = (i === 1) || (dig[i - 2] !== dig[i]);
      const notContinuingAfter = (i + 1 === dig.length) || (dig[i + 1] !== dig[i]);

      if (notContinuingBefore && notContinuingAfter) {
        return true;
      }
    }
  }

  return false;
}

const neverDecreases = (dig) => {
  if (dig.length < 2) {
    return true;
  }

  for (let i = 1; i < dig.length; ++i) {
    if (dig[i - 1] > dig[i]) {
      return false;
    }
  }

  return true;
}



const isValid = (dig) => {
  if (dig.length != 6 || dig[0] == 0) {
    return false; // It is a six-digit number.
  }

  // implied by the execution:  The value is within the range given in your puzzle input.

  if (!hasAdjacentDigitsNotPartOfLargerGroup(dig)) {
    return false; // Two adjacent digits are the same (like 22 in 122345).
  }

  if (!neverDecreases(dig)) {
    return false; // Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
  }

  return true;
}

const run = () => {
  // make sure same number of digits (pad with zeros if needed)
  const startRange = "382345";
  const endRange   = "843167";
  
  let stopDigits = parseNumberToArray(endRange);

  let currDigits = parseNumberToArray(startRange);

  let numValid = 0;
  while (isLessEqual(currDigits,stopDigits)) {
    if (isValid(currDigits)) {
      numValid++;
    }

    currDigits = next(currDigits);
  }

  console.log(numValid);
}

module.exports = { run }
