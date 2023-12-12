function findStart(grid: string[]): [number, number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] == 'S') {
        return [row, col];
      }
    }
  }
  throw new Error('start not found');
}

type Pos = [number, number];

function isValidPos(grid: string[], pos: Pos): boolean {
  const [row, col] = pos;
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;
}

function indexGrid(grid: string[], pos: Pos): string {
  if (!isValidPos(grid, pos)) {
    throw new Error('using invalid position to index the grid');
  }
  const [row, col] = pos;
  return grid[row][col];
}

const deltas: Pos[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

const namedDeltas: Record<Direction, Pos> = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1]
}

function adjacentPositionsNoCheck(grid: string[], pos: Pos): Pos[] {
  return deltas.map(([drow, dcol]) => [pos[0] + drow, pos[1] + dcol] as Pos).filter(p => isValidPos(grid, p));
}

type Direction = 'up' | 'down' | 'left' | 'right'

function adjacentDirections(grid: string[], pos: Pos): Direction[] {
  const c = indexGrid(grid, pos);
  switch (c) {
    case '|':
      return ['up', 'down']
    case '-':
      return ['left', 'right']
    case 'L':
      return ['up', 'right']
    case 'J':
      return ['up', 'left']
    case '7':
      return ['down', 'left']
    case 'F':
      return ['down', 'right']
    case '.':
      return []
    case 'S':
      return (['up', 'down', 'left', 'right'] as Direction[]).filter(dir => startConnected(grid, pos, dir));
    default:
      throw new Error(`should not have got char ${c}`);
  }
}

function applyDirection(pos: Pos, direction: Direction): Pos {
  const [row, col] = pos;
  const [drow, dcol] = namedDeltas[direction];
  return [row + drow, col + dcol];
}

function oppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'up':
      return 'down';
    case 'down':
      return 'up';
  }
}

function startConnected(grid: string[], startPos: Pos, dir: Direction): boolean {
  const newPos = applyDirection(startPos, dir);
  if (!isValidPos(grid, newPos)) {
    return false;
  }

  const newConnected = adjacentDirections(grid, newPos);
  return newConnected.findIndex(v => v === oppositeDirection(dir)) !== -1;
}

function posKey(pos: Pos): string {
  const [row, col] = pos;
  return `${row}:${col}`
}

export function solve10A(input: string): number {
  const grid = input.split('\n');
  const startPos = findStart(grid);
  const dist = new Map<string, number>;
  const queue: [Pos, number][] = [[startPos, 0]];
  let maxDist = 0;

  for (let i = 0; i < queue.length; i++) {
    const [pos, currDist] = queue[i];
    const key = posKey(pos);
    if (dist.has(key)) {
      continue;
    }

    dist.set(key, currDist);
    maxDist = Math.max(maxDist, currDist);
    const nexts = adjacentDirections(grid, pos).map(dir => applyDirection(pos, dir));
    for (const next of nexts) {
      queue.push([next, currDist + 1]);
    }
  }

  return maxDist;
}

export function solve10B(input: string): number {
  const grid = input.split('\n');
  const startPos = findStart(grid);
  const dist = new Map<string, number>;
  const queue: [Pos, number][] = [[startPos, 0]];

  for (let i = 0; i < queue.length; i++) {
    const [pos, currDist] = queue[i];
    const key = posKey(pos);
    if (dist.has(key)) {
      continue;
    }

    dist.set(key, currDist);
    const nexts = adjacentDirections(grid, pos).map(dir => applyDirection(pos, dir));
    for (const next of nexts) {
      queue.push([next, currDist + 1]);
    }
  }

  let insideCount = 0;
  for (let row = 0; row < grid.length; row++) {
    let inside = false;
    let lastPipe = false;
    for (let col = 0; col < grid[row].length; col++) {
      const key = posKey([row, col]);

      if (dist.has(key)) {
        // Inside the pipe
        lastPipe = true;
      }
      else {
        // Not inside the main pipe loop
        if (lastPipe) {
          inside = !inside;
          lastPipe = false;
        }
        if (inside) {
          console.log({row, col});
          insideCount++;
        }
      }
    }
  }

  return insideCount;
}
