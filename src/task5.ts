import { concatArrays, min2 } from "./operators";
import { ensureMatch, pairs, readNumbers } from "./utils";

const mapNamePattern = /^([a-z]+)-to-([a-z]+) map:$/

interface AlmanacMap {
  from: string;
  to: string;
  mapping: [number, number, number][];
}

function parseMap(input: string): AlmanacMap {
  const lines = input.split('\n');
  const nameMatch = ensureMatch(mapNamePattern, lines[0]);

  const from = nameMatch[1];
  const to = nameMatch[2];
  const mapping: [number, number, number][] = [];

  for (let i = 1; i < lines.length; i++) {
    const arr = readNumbers(lines[i]);
    mapping.push([arr[0], arr[1], arr[2]]);
  }

  mapping.sort((x, y) => x[1] - y[1]);

  return { from, to, mapping };
}

interface TransformValue {
  kind: string;
  value: number;
}

function applyTransform(input: number, fn: [number, number, number][]): number {
  for (const triple of fn) {
    if (input >= triple[1] && input < triple[1] + triple[2]) {
      return triple[0] + (input - triple[1]);
    }
  }
  return input;
}

// First argument included, second argument excluded
function applyRangeTransform(from: number, to: number, fn: [number, number, number][]): [number, number][] {
  const result: [number, number][] = [];

  for (const triple of fn) {
    if (from < triple[1]) {
      const upTo = Math.min(to, triple[1]);
      result.push([from, upTo]);

      if (to === upTo) {
        break;
      }
      from = upTo;
    }

    if (triple[1] < to) {
      const amount = Math.min(to - triple[1], triple[2]);
      result.push([triple[0], triple[0] + amount]);

      from += amount;
    }

    if (from === to) {
      break;
    }
  }

  return result;
}

interface TransformRange {
  kind: string;
  from: number;
  to: number;
}

function applyRangeMap(map: AlmanacMap, value: TransformRange): TransformRange[] {
  if (map.from !== value.kind) {
    throw new Error(`kind mismatch: ${map.from} and ${value.kind}`);
  }

  return applyRangeTransform(value.from, value.to, map.mapping).map(([from, to]) => {
    return {
      kind: map.to,
      from,
      to
    }
  });
}

function applyRangeMaps(from: number, count: number, maps: AlmanacMap[]): TransformRange[] {
  let result: TransformRange[] = [{
    kind: 'seed',
    from: from,
    to: from + count
  }];

  for (const map of maps) {
    result = result.map(range => applyRangeMap(map, range)).reduce(concatArrays);
  }

  return result;
}

function applyMap(map: AlmanacMap, value: TransformValue): TransformValue {
  if (map.from !== value.kind) {
    throw new Error(`kind mismatch: ${map.from} and ${value.kind}`);
  }

  return {
    kind: map.to,
    value: applyTransform(value.value, map.mapping)
  }
}

function applyMaps(seed: number, maps: AlmanacMap[]): number {
  let value: TransformValue = {
    kind: 'seed',
    value: seed
  };

  for (const map of maps) {
    value = applyMap(map, value);
  }

  return value.value;
}

export function solve5A(input: string): number {
  const parts = input.split('\n\n');
  const seeds = readNumbers(parts[0]);
  const maps = parts.slice(1).map(parseMap);
  return seeds.map(seed => applyMaps(seed, maps)).reduce(min2);
}

export function solve5B(input: string): number {
  const parts = input.split('\n\n');
  const seedRanges = pairs(readNumbers(parts[0]));
  const maps = parts.slice(1).map(parseMap);

  return seedRanges.map(([from, count]) => applyRangeMaps(from, count, maps)).reduce(concatArrays).map(range => range.from).reduce(min2);
}
