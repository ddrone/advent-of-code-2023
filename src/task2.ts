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

    console.log(pair);
    const count = Number(pair[0]);
    switch (pair[1]) {
      case 'blue':
        result.blue = count;
        break;
      case 'red':
        result.blue = count;
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

export function solve2A(input: string): string {
  console.log(input);
  const lines = input.split('\n');
  console.log(lines.map(parseGame));
  return '';
}
