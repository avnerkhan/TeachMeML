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
    newData[labels.get(c)] = currentLabelList;
  }

  return newData;
}

// Gets all data from labeledData and puts it in an array
export function getAllData(labeledData) {
  let allData = [];

  for (const color in labeledData) {
    const currentList = labeledData[color];
    for (const point of currentList) {
      allData.push(point);
    }
  }

  return allData;
}

function findCorrelatedColor(point, labeledData) {
  for (const key in labeledData) {
    if (labeledData[key].includes(point)) return key;
  }
  return null;
}

// Labels data as its color based on the state array that
// it orginally belongs to
export function relabelData(point, labeledData) {
  point["class"] = findCorrelatedColor(point, labeledData);
  return point;
}
