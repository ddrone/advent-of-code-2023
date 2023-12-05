const numberPattern = /[0-9]+/g;

export function readNumbers(input: string): number[] {
  const result: number[] = [];

  for (const match of input.matchAll(numberPattern)) {
    result.push(Number(match[0]));
  }

  return result;
}

