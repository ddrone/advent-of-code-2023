import { ChangeEvent } from "react";

function processLine(input: string): number {
  let firstDigit = -1;
  let lastDigit = -1;

  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i);
    if (c < '0' || c > '9') {
      continue;
    }

    const digit = c.charCodeAt(0) - '0'.charCodeAt(0);
    if (firstDigit === -1) {
      firstDigit = digit;
    }
    lastDigit = digit;
  }

  if (firstDigit === -1) {
    throw new Error('no digits found!');
  }

  console.log({firstDigit, lastDigit});
  return firstDigit * 10 + lastDigit;
}

function Task1A() {
  function inputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const input = e.target.value;
    const results = input.split('\n').map(processLine);
    console.log(results.reduce((x, y) => x + y));
  }
  return (
    <>
      <textarea onChange={inputChange}></textarea>
    </>
  )
}

export default Task1A