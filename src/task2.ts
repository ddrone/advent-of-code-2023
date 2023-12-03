import { add } from "./operators";

interface Hand {
  red: number;
  green: number;
  blue: number;
}

interface Game {
  id: number;
  hands: Hand[];
}

function parseHand(hand: string): Hand {
  const result: Hand = {
    red: 0,
    green: 0,
    blue: 0
  };

  for (const chunk of hand.split(', ')) {
    const pair = chunk.split(' ');
    if (pair.length !== 2) {
      throw new Error(`can't parse hand ${hand}`);
    }

    const count = Number(pair[0]);
    switch (pair[1]) {
      case 'blue':
        result.blue = count;
        break;
      case 'red':
        result.red = count;
        break;
      case 'green':
        result.green = count;
        break;
      default:
        throw new Error(`unknown color ${pair[1]}`);
    }
  }

  return result;
}

function parseGame(game: string): Game {
  const idMatch = game.match(/^Game ([0-9]+): /);
  if (idMatch === null) {
    throw new Error("can't get game id");
  }

  const id = Number(idMatch[1]);
  const hands = game.substring(idMatch[0].length).split('; ').map(parseHand);
  return { id, hands };
}

function handPossible(hand: Hand): boolean {
  return hand.red <= 12 && hand.green <= 13 && hand.blue <= 14;
}

function gamePossible(game: Game): boolean {
  return game.hands.map(handPossible).reduce((x, y) => x && y);
}

function maxHand(h1: Hand, h2: Hand): Hand {
  return {
    red: Math.max(h1.red, h2.red),
    green: Math.max(h1.green, h2.green),
    blue: Math.max(h1.blue, h2.blue)
  };
}

function handPower(h: Hand): number {
  return h.red * h.green * h.blue;
}

export function solve2A(input: string): number {
  const lines = input.split('\n');
  const output = lines.map(parseGame).filter(gamePossible).map(game => game.id).reduce(add);
  return output;
}

export function solve2B(input: string): number {
  const lines = input.split('\n');
  const output = lines.map(parseGame).map(game => game.hands.reduce(maxHand)).map(handPower).reduce(add);
  return output;
}
