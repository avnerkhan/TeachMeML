// Generates random points to put on plot, and clears undetermined points
export function generateRandomData(length, max, labels) {
  let newData = {};

  for (let c = 0; c < labels.size; c++) {
    let currentLabelList = [];
    for (let i = 0; i < length; i++) {
      const randomX = Math.floor(Math.random() * max);
      const randomY = Math.floor(Math.random() * max);
      const entry = { x: randomX, y: randomY };
      currentLabelList.push(entry);
    }
    console.log(labels.get(c));
    newData[labels.get(c)] = currentLabelList;
  }

  return newData;
}
