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

export function solve1A(input: string): string {
  const results = input.split('\n').map(processLine);
  const sum = results.reduce((x, y) => x + y);
  return `${sum}`;
}
