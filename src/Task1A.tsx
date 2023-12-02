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

interface Digit {
  digit: string;
  location: number;
}

function findFirstAndLastDigits(input: string): [Digit, Digit] {
  let firstDigit: Digit|undefined;
  let lastDigit: Digit|undefined;

  for (let i = 0; i < input.length; i++) {
    if (!/[0-9]/.test(input.charAt(i))) {
      continue;
    }

    const digit = {
      digit: input[i],
      location: i
    }
    if (firstDigit === undefined) {
      firstDigit = digit;
    }
    lastDigit = digit;
  }

  if (firstDigit === undefined || lastDigit === undefined) {
    throw new Error('no digits found!');
  }

  return [firstDigit, lastDigit];
}

const digits = 'one 1 two 2 three 3 four 4 five 5 six 6 seven 7 eight 8 nine 9'.split(' ');

function digitNum(n: string): number {
  if (!/^[0-9]$/.test(n)) {
    throw new Error(`${n} is not a digit!`);
  }

  return n.charCodeAt(0) - '0'.charCodeAt(0);
}

function solve1BLine(input: string): number {
  let [firstDigit, lastDigit] = findFirstAndLastDigits(input);
  for (let i = 0; i < digits.length; i += 2) {
    const firstOcc = input.indexOf(digits[i]);
    if (firstOcc !== -1 && firstOcc < firstDigit.location) {
      firstDigit = {
        digit: digits[i + 1],
        location: firstOcc
      }

      const lastOcc = input.lastIndexOf(digits[i]);
      if (lastDigit.location < lastOcc) {
        lastDigit = {
          digit: digits[i + 1],
          location: lastOcc
        }
      }
    }
  }

  return digitNum(firstDigit.digit) * 10 + digitNum(lastDigit.digit);
}

export function solve1A(input: string): string {
  const results = input.split('\n').map(processLine);
  const sum = results.reduce((x, y) => x + y);
  return `${sum}`;
}

export function solve1B(input: string): string {
  const inputs = input.split('\n').map(solve1BLine);
  const sum = inputs.reduce((x, y) => x + y);
  return `${sum}`;
}
