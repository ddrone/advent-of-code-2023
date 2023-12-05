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
