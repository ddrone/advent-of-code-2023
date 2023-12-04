import { add } from "./operators";

const cardPattern = /Card +[0-9]+: +((?:[0-9]+ *)+)\| +((?:[0-9]+ *)+)/

const numberPattern = /[0-9]+/g;

function readNumbers(input: string): number[] {
  const result: number[] = [];

  for (const match of input.matchAll(numberPattern)) {
    result.push(Number(match[0]));
  }

  return result;
}

interface Card {
  selected: Set<number>;
  winning: number[];
}

function parseCard(card: string): Card {
  const match = card.match(cardPattern);
  if (match === null) {
    throw new Error(`can't parse card ${card}`);
  }

  const selected = new Set(readNumbers(match[1]));
  const winning = readNumbers(match[2]);
  return { selected, winning }
}

function countScore(card: Card): number {
  let result = 0;
  for (const winning of card.winning) {
    if (card.selected.has(winning)) {
      if (result === 0) {
        result = 1;
      }
      else {
        result *= 2;
      }
    }
  }
  return result;
}

function countWinning(card: Card): number {
  return card.winning.filter(e => card.selected.has(e)).length;
}

function countCards(cards: Card[]): number[] {
  const result: number[] = new Array(cards.length).fill(1);

  for (let i = 0; i < cards.length; i++) {
    const winning = countWinning(cards[i]);
    for (let j = 1; j <= winning && i + j < cards.length; j++) {
      result[i + j] += result[i];
    }
  }

  return result;
}

export function solve4A(input: string): number {
  const output = input.split('\n').map(parseCard).map(countScore).reduce(add);
  return output;
}

export function solve4B(input: string): number {
  const cards = countCards(input.split('\n').map(parseCard))
  return cards.reduce(add);
}
