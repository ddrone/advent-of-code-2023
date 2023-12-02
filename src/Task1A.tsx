function processLine(input: string): number {
  let firstDigit = -1;
  let lastDigit = -1;

  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i);
    if (c < '0' || c > '9') {
      continue;
    }

    const digit = c.charCodeAt(0) - '0'.charCodeAt(0);
    if (firstDigit === -1) {
      firstDigit = digit;
    }
    lastDigit = digit;
  }

  if (firstDigit === -1) {
    throw new Error('no digits found!');
  }

  return firstDigit * 10 + lastDigit;
}

const digits = 'one 1 two 2 three 3 four 4 five 5 six 6 seven 7 eight 8 nine 9'.split(' ');

function preprocessLine(input: string): string {
  for (let i = 0; i < digits.length; i += 2) {
    input = input.replace(new RegExp(digits[i], 'g'), digits[i + 1]);
  }
  return input;
}

export function solve1A(input: string): string {
  const results = input.split('\n').map(processLine);
  const sum = results.reduce((x, y) => x + y);
  return `${sum}`;
}

export function solve1B(input: string): string {
  const inputs = input.split('\n').map(preprocessLine);
  const results = inputs.map(processLine);
  console.log({inputs, results});
  const sum = results.reduce((x, y) => x + y);
  return `${sum}`;
}
