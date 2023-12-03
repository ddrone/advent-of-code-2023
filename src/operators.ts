export function add(x: number, y: number): number {
  return x + y;
}

export function concatArrays<T>(x: T[], y: T[]): T[] {
  return x.concat(y);
}
