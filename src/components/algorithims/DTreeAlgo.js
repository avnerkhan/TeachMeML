// For determing ties when a node has multiple labels in its dataset
export function determineMostLikelyLabel(data) {
  let posLabelCount = 0;

  for (let entry of data) {
    posLabelCount += entry.label === 1 ? 1 : 0;
  }

  if (posLabelCount / data.length === 0.5) {
    return "1/0";
  }

  return posLabelCount / data.length > 0.5 ? 1 : 0;
}

// Determines best split based on comparing gain ratios of all entries
export function determineBestSplit(dataLabels, data) {
  let currentHighestGainLabel = "";
  let currentHighestGain = 0.0;

  for (let i = 0; i < dataLabels.length; i++) {
    const currGain = calculateGainRatio(i, data);

    if (currGain > currentHighestGain) {
      currentHighestGain = currGain;
      currentHighestGainLabel = dataLabels[i];
    }
  }
  return currentHighestGainLabel;
}

// Refer to practice exam 1 decision tree for algorithim.

// Calculates gain ratio from splitting on feature
function calculateGainRatio(feature, data) {
  const gain = calculateGain(feature, data);
  const splitInfo = calculateSplitInfo(feature, data);
  return gain / splitInfo;
}

function calculateSplitInfo(feature, data) {
  const giniMap = getGiniMap(feature, data, false);
  let totalSplit = 0.0;

  for (const entry in giniMap) {
    const fraction = giniMap[entry].totalNum / data.length;
    totalSplit += -fraction * Math.log2(fraction);
  }

  return totalSplit;
}

// Calculates information gain from splitting on feature
function calculateGain(feature, data) {
  const overallEntropy = calculateGiniValue(data);
  const splitValue = calculateSplitGini(feature, data);
  return overallEntropy - splitValue;
}

// Based on the currently given dataset, calculate the positive and negative
// counts. Can be used to calculate overall entropy of dataset or gini
// of specific features
export function calculateGiniValue(data) {
  const posNegCount = countPositiveAndNegative(data);
  const posSquared = getSquaredNumber(posNegCount.pos, data.length);
  const negSquared = getSquaredNumber(posNegCount.neg, data.length);

  return 1 - posSquared - negSquared;
}

// Returns a number divided by total dataset length and squares it
function getSquaredNumber(number, dataLength) {
  const ratio = number / dataLength;
  return ratio * ratio;
}

// Function that basically takes dataset, and creates one map that
// has all different classes for that feature, with class as a key,
// and the value is the total count of that class and the positive count
// The function then creates another map that has classes as keys and
// has the values as the calculated gini of that class and the total count
export function getGiniMap(feature, data, returnOnlyClassMap) {
  let classMap = {};
  let returnMap = {};

  for (const entry of data) {
    const currentFeature = entry[feature];
    const positiveCount = entry.label;
    if (classMap[currentFeature] == null) {
      classMap[currentFeature] = { totalCount: 1, posCount: positiveCount };
    } else {
      const currentTotalCount = classMap[currentFeature].totalCount;
      const currentPositiveCount = classMap[currentFeature].posCount;
      classMap[currentFeature] = {
        totalCount: currentTotalCount + 1,
        posCount: currentPositiveCount + positiveCount
      };
    }
  }

  if (returnOnlyClassMap) {
    return classMap;
  }

  for (const classVal in classMap) {
    const mapEntry = {
      giniValue: calculateGiniValue(filteredData(classVal, feature, data)),
      totalNum: classMap[classVal].totalCount
    };
    returnMap[classVal] = mapEntry;
  }

  return returnMap;
}

// Filters data so that a new dataset is created for only that class
// in a specific feature
export function filteredData(classVal, feature, data) {
  let dataToReturn = [];

  for (const entry of data) {
    if (entry[feature] === classVal) {
      dataToReturn.push(entry);
    }
  }

  return dataToReturn;
}

// Calculates split gini for feature
function calculateSplitGini(feature, data) {
  const giniMap = getGiniMap(feature, data, false);
  let totalSplit = 0.0;

  for (let entry in giniMap) {
    const fractionValue = giniMap[entry].totalNum / data.length;
    totalSplit += fractionValue * giniMap[entry].giniValue;
  }

  return totalSplit;
}

// Counts number of negative and positive labels in a dataset
function countPositiveAndNegative(data) {
  let positiveCount = 0;
  let negativeCount = 0;

  for (let entry of data) {
    const label = entry.label;
    if (label === 1) {
      positiveCount++;
    } else {
      negativeCount++;
    }
  }

  return { pos: positiveCount, neg: negativeCount };
}
