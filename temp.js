function appedspace(count, character) {
  let empty = character;

  for (let i = count; i > 0; i -= 1) {
    empty += character;
  }
  return empty;
}

function printpattern(inputLines) {
  for (let i = 1; i <= inputLines; i += 1) {
    console.log(`${appedspace(inputLines - i, ' ')}${appedspace(inputLines, '*')}`);
  }
}

printpattern(5);
