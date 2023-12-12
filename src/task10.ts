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

type ScanState = 'in' | 'out' | 'pipe_from_out' | 'pipe_from_in';
type BoundaryState = 'nbd' | 'boundary_bot' | 'boundary_top';

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

  const startAdjacent = new Set(adjacentDirections(grid, startPos));
  if (startAdjacent.size !== 2) {
    throw new Error('unknown replacement');
  }

  const startRow = startPos[0];
  if (startAdjacent.has('down') && startAdjacent.has('right')) {
    grid[startRow] = grid[startRow].replace('S', 'F');
  }
  else if (startAdjacent.has('up') && startAdjacent.has('down')) {
    grid[startRow] = grid[startRow].replace('S', '|');
  }
  else {
    console.log(startAdjacent);
    throw new Error('unhandled option');
  }

  let insideCount = 0;
  for (let row = 0; row < grid.length; row++) {
    let inside = false;
    let state: BoundaryState = 'nbd';

    for (let col = 0; col < grid[row].length; col++) {
      const pos: Pos = [row, col];
      const key = posKey(pos);

      if (dist.has(key)) {
        const c = indexGrid(grid, pos);
        switch (state) {
          case 'nbd': {
            switch (c) {
              case 'F':
                state = 'boundary_bot';
                break;
              case '|':
                inside = !inside;
                break;
              case 'L':
                state = 'boundary_top';
                break;
              default:
                throw new Error(`unexpected char ${c}`);
            }
            break;
          }
          case 'boundary_bot':
            switch (c) {
              case '7':
                state = 'nbd';
                break;
              case '-':
                break;
              case 'J':
                state = 'nbd';
                inside = !inside;
                break;
              default:
                throw new Error(`unexpected char ${c}`);
            }
            break;
          case 'boundary_top':
            switch (c) {
              case '7':
                state = 'nbd';
                inside = !inside;
                break;
              case '-':
                break;
              case 'J':
                state = 'nbd';
                break;
              default:
                throw new Error(`unexpected char ${c}`);
            }
        }
      }
      else if (inside && state === 'nbd') {
        insideCount++;
      }
    }
  }

  return insideCount;
}
