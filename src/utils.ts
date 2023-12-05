const numberPattern = /[0-9]+/g;

export function readNumbers(input: string): number[] {
  const result: number[] = [];

  for (const match of input.matchAll(numberPattern)) {
    result.push(Number(match[0]));
  }

  return result;
}

export function ensureMatch(pattern: RegExp, text: string): RegExpMatchArray {
  const result = text.match(pattern);
  if (result === null) {
    throw new Error('match failed!');
  }

  return result;
}

export function pairs<T>(input: T[]): [T, T][] {
  if (input.length % 2 !== 0) {
    throw new Error('parity error');
  }

  const result: [T, T][] = [];
  for (let i = 0; i + 1 < input.length; i += 2) {
    result.push([input[i], input[i + 1]]);
  }
  return result;
}
