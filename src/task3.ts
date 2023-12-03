import { add, concatArrays } from "./operators";

interface GridNumber {
  rowIndex: number;
  colIndex: number;
  length: number;
  number: number;
}

function findNumbers(row: string, rowIndex: number): GridNumber[] {
  const result: GridNumber[] = [];
  for (const match of row.matchAll(/[0-9]+/g)) {
    const col = match.index;
    if (col === undefined) {
      throw new Error('no index in regex match for some reason');
    }

    result.push({
      rowIndex,
      colIndex: col,
      length: match[0].length,
      number: Number(match[0])
    });
  }

  return result;
}

function hasSymbol(grid: string[], rowIndex: number, colIndex: number) {
  if (rowIndex < 0 || rowIndex >= grid.length) {
    return false;
  }

  const row = grid[rowIndex];
  if (colIndex < 0 || colIndex >= row.length) {
    return false;
  }

  const char = row[colIndex];
  return !(/[0-9.]/.test(char));
}

function hasGear(grid: string[], rowIndex: number, colIndex: number): boolean {
  if (rowIndex < 0 || rowIndex >= grid.length) {
    return false;
  }

  const row = grid[rowIndex];
  if (colIndex < 0 || colIndex >= row.length) {
    return false;
  }

  return row[colIndex] === '*';
}

interface GridPos {
  rowIndex: number;
  colIndex: number;
}

function findGears(n: GridNumber, grid: string[]): GridPos[] {
  const result: GridPos[] = [];
  function test(rowIndex: number, colIndex: number) {
    if (hasGear(grid, rowIndex, colIndex)) {
      result.push({
        rowIndex, colIndex
      });
    }
  }

  for (let colIndex = n.colIndex - 1; colIndex <= n.colIndex + n.length; colIndex++) {
    test(n.rowIndex - 1, colIndex);
    test(n.rowIndex + 1, colIndex);
  }

  test(n.rowIndex, n.colIndex - 1);
  test(n.rowIndex, n.colIndex + n.length);
  return result;
}

function isPart(n: GridNumber, grid: string[]): boolean {
  for (let colIndex = n.colIndex - 1; colIndex <= n.colIndex + n.length; colIndex++) {
    if (hasSymbol(grid, n.rowIndex - 1, colIndex) || hasSymbol(grid, n.rowIndex + 1, colIndex)) {
      return true;
    }
  }

  return hasSymbol(grid, n.rowIndex, n.colIndex - 1) || hasSymbol(grid, n.rowIndex, n.colIndex + n.length);
}

export function solve3A(input: string): number {
  const grid = input.split('\n');
  return grid.map(findNumbers).reduce(concatArrays).filter(n => isPart(n, grid)).map(n => n.number).reduce(add);
}

export function solve3B(input: string): number {
  const grid = input.split('\n');
  const numbers = grid.map(findNumbers).reduce(concatArrays);
  const gearMap = new Map<string, GridNumber[]>();

  for (const n of numbers) {
    for (const gear of findGears(n, grid)) {
      const gridKey = `${gear.rowIndex},${gear.colIndex}`;
      const adjNumbers = gearMap.get(gridKey);
      if (adjNumbers === undefined) {
        gearMap.set(gridKey, [n]);
      }
      else {
        adjNumbers.push(n);
      }
    }
  }

  return [...gearMap.values()].filter(a => a.length === 2).map(a => a[0].number * a[1].number).reduce(add);
}
