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
  return grid.map(findNumbers).reduce((x, y) => x.concat(y)).filter(n => isPart(n, grid)).map(n => n.number).reduce((x, y) => x + y);
}
