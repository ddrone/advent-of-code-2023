import { min2 } from "./operators";
import { ensureMatch, readNumbers } from "./utils";

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

function applyMap(map: AlmanacMap, value: TransformValue) {
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
  console.log(seeds);
  console.log(maps);
  return seeds.map(seed => applyMaps(seed, maps)).reduce(min2);
}
