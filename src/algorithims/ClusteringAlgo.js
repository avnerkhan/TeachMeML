/* eslint-disable */
import { euclidFunction, comparator } from "../Utility";

export function generateEmptyCluster() {
  let emptyClusterHolder = [];

  for (let i = 0; i < 100; i++) emptyClusterHolder.push([]);

  return emptyClusterHolder;
}

// Generates Array of random colors
export function generateRandomColors() {
  let colorArr = [];

  for (let i = 0; i < 100; i++) {
    colorArr.push(newRandomColor());
  }

  return colorArr;
}

// Generates a single random hex color
function newRandomColor() {
  const potential = "ABCDEF0123456789";
  let toReturn = "#";

  for (let i = 0; i < 6; i++) {
    const randomHexIndex = Math.floor(Math.random() * potential.length);
    toReturn += potential.substring(randomHexIndex, randomHexIndex + 1);
  }

  return toReturn;
}

// Runs db scan on unlabeled data
export function runDBScan(
  unlabeled,
  minEps,
  minPts,
  stateEnum,
  centroidData,
  clusteredData
) {
  let clusters = 0;

  for (let point of unlabeled) {
    if (point.label == undefined) {
      let neighbhors = unlabeled.filter(
        comparePoint => euclidFunction(point, comparePoint).distance <= minEps
      );

      if (neighbhors.length >= minPts) {
        clusters++;
        point.label = clusters;

        for (let newPoint of neighbhors) {
          if (newPoint.label == stateEnum.OUTLIER) newPoint.label = clusters;

          if (newPoint.label == undefined) {
            newPoint.label = clusters;
            const newNeighbhors = unlabeled.filter(
              comparePoint =>
                euclidFunction(newPoint, comparePoint).distance <= minEps
            );

            if (newNeighbhors.length >= minPts) {
              for (const nextDoor of newNeighbhors) neighbhors.push(nextDoor);
            }
          }
        }
      } else {
        point.label = stateEnum.OUTLIER;
      }
    }
  }

  return relabelData(unlabeled, clusteredData, centroidData);
}

// Takes data and places into clusters based on label
function relabelData(newData, clusterData, outlierData) {
  for (const point of newData) {
    if (point.label === 0) {
      outlierData.push(point);
    } else {
      if (clusterData[point.label] != undefined)
        clusterData[point.label].push(point);
    }
  }

  return [clusterData, outlierData];
}

// Restarts DBScan by making all points unlabeled again
export function unclusterData(unlabeled, outliers, clusters) {
  for (const cluster of clusters) {
    for (const point of cluster) {
      unlabeled.push({ x: point.x, y: point.y });
    }
  }

  for (const outlier of outliers) {
    unlabeled.push({ x: outlier.x, y: outlier.y });
  }

  return unlabeled;
}

// Runs an iteration of K means. Either determines centroid or labels data
// based on current centroid
export function runIteration(centroidData, clusterData, unlabeledData) {
  if (unlabeledData.length > 0) {
    for (let point of unlabeledData) {
      if (point !== undefined && !isNaN(point.x)) {
        let nearestMap = centroidData.map(centroid =>
          euclidFunction(centroid, point)
        );
        nearestMap.sort(comparator);
        const nearestCentroid = nearestMap[0].orginalPoint;
        clusterData[centroidData.indexOf(nearestCentroid)].push(point);
      }
    }
  } else {
    for (let count = 0; count < clusterData.length; count++) {
      const cluster = clusterData[count];
      let xAvg = 0.0;
      let yAvg = 0.0;

      for (const point of cluster) {
        xAvg += point.x;
        yAvg += point.y;
        unlabeledData.push(point);
      }

      xAvg = xAvg / cluster.length;
      yAvg = yAvg / cluster.length;

      const newCentroid = { x: xAvg, y: yAvg };
      centroidData[count] = newCentroid;
      clusterData[count] = [];
    }
  }

  return [unlabeledData, clusterData, centroidData];
}

export function pushIntoCentroid(newCentroidState, datapoint) {
  newCentroidState.push(datapoint);
  return newCentroidState;
}

// get coordinate based on click and bounds
function calculateScale(coordClick, bound, scale) {
  const offset = coordClick - bound;
  return (offset / scale) * 100;
}

// Allows user to add a small cluster unlabeled points for later labeling
export function smallClusterDrop(
  xClick,
  yClick,
  xBound,
  yBound,
  width,
  height,
  choosingCentroidState,
  runningKMeans,
  factor,
  numberPoints,
  newData
) {
  if (!choosingCentroidState && !runningKMeans) {
    const xCoord = calculateScale(xClick, xBound, width);
    const yCoord = 120 - calculateScale(yClick, yBound, height);
    if (newData[0].x === 0 && newData[0].y === 0) newData.shift();

    const cardinal = [
      [0, 0],
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1]
    ];

    for (let i = 0; i < numberPoints; i++) {
      const direction = cardinal[i];
      newData.push({
        x: xCoord + direction[0] * factor,
        y: yCoord + direction[1] * factor
      });
    }

    return newData;
  }
}

export function deployRandomClusters(
  randomClusterNumber,
  runningCentroidState,
  runningKMeans,
  factor,
  numberPoints,
  newData
) {
  let unlabeledData = [];
  const max = 100;

  for (let i = 0; i < randomClusterNumber; i++) {
    const randomX = Math.floor(Math.random() * max);
    const randomY = Math.floor(Math.random() * max);
    const clusterDrop = smallClusterDrop(
      randomX,
      randomY,
      runningCentroidState,
      runningKMeans,
      factor,
      numberPoints,
      newData
    );
    debugger;

    unlabeledData = unlabeledData.concat(clusterDrop);
  }

  return unlabeledData;
}
