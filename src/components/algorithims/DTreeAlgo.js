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
export function determineBestSplit(dataLabels, data, isGini) {
  let currentHighestGainLabel = "";
  let currentHighestGain = 0.0;

  for (let i = 0; i < dataLabels.size; i++) {
    const currGain = calculateGainRatio(dataLabels.get(i), data, isGini);

    if (currGain > currentHighestGain) {
      currentHighestGain = currGain;
      currentHighestGainLabel = dataLabels.get(i);
    }
  }
  return { currentHighestGainLabel, currentHighestGain };
}

// Refer to practice exam 1 decision tree for algorithim.

// Calculates gain ratio from splitting on feature
function calculateGainRatio(feature, data, isGini) {
  // Problem in one of these two functions
  const gain = calculateGain(feature, data, isGini);
  const splitInfo = calculateSplitInfo(feature, data);
  if (splitInfo === 0) return 0;
  return gain / splitInfo;
}

function calculateSplitInfo(feature, data) {
  const featureMap = getMap(feature, data, false);
  let totalSplit = 0.0;

  for (const entry in featureMap) {
    const fraction = featureMap[entry].totalNum / data.length;
    totalSplit += -fraction * Math.log2(fraction);
  }

  return totalSplit;
}

// Calculates information gain from splitting on feature
function calculateGain(feature, data, isGini) {
  const overallImpurity = calculateImpurityValue(data, isGini);
  const splitValue = calculateSplit(feature, data, isGini);
  return overallImpurity - splitValue;
}

// Based on the currently given dataset, calculate the positive and negative
// counts. Can be used to calculate overall impurity of dataset or gini
// of specific features
export function calculateImpurityValue(data, isGini) {
  const posNegCount = countPositiveAndNegative(data);

  if (isGini) {
    const posSquared = getSquaredNumber(posNegCount.pos, data.length);
    const negSquared = getSquaredNumber(posNegCount.neg, data.length);

    return 1 - posSquared - negSquared;
  }

  const posRatio = posNegCount.pos / data.length;
  const negRatio = posNegCount.neg / data.length;

  const posCalc = posRatio === 0 ? 0 : -(posRatio * Math.log2(posRatio));
  const negCalc = negRatio === 0 ? 0 : -(negRatio * Math.log2(negRatio));

  return posCalc + negCalc;
}

// Returns a number divided by total dataset length and squares it
function getSquaredNumber(number, dataLength) {
  if (dataLength === 0) return 0;
  const ratio = number / dataLength;
  return ratio * ratio;
}

// Function that basically takes dataset, and creates one map that
// has all different classes for that feature, with class as a key,
// and the value is the total count of that class and the positive count
// The function then creates another map that has classes as keys and
// has the values as the calculated gini of that class and the total count
export function getMap(feature, data, returnOnlyClassMap, isGini) {
  let classMap = {};
  let returnMap = {};

  for (const entry of data) {
    const positiveCount = entry.label;
    const currentFeature = entry[feature];
    // Problem Somewhere here
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
      impurityValue: calculateImpurityValue(
        filteredData(classVal, feature, data),
        isGini
      ),
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
function calculateSplit(feature, data, isGini) {
  const featureMap = getMap(feature, data, false, isGini);
  let totalSplit = 0.0;

  for (let entry in featureMap) {
    const fractionValue = featureMap[entry].totalNum / data.length;
    totalSplit += fractionValue * featureMap[entry].impurityValue;
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
