// Generates random points to put on plot, and clears undetermined points
export function generateRandomData(length = 100, max = 100) {
  let newDataPositive = [];
  let newDataNegative = [];

  for (let i = 0; i < length; i++) {
    const randomX = Math.floor(Math.random() * max);
    const randomY = Math.floor(Math.random() * max);
    const entry = { x: randomX, y: randomY };

    if (i % 2 === 0) {
      newDataPositive.push(entry);
    } else {
      newDataNegative.push(entry);
    }
  }

  return { positive: newDataPositive, negative: newDataNegative };
}
