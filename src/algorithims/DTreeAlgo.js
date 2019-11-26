import { is } from "immutable";

// For determing ties when a node has multiple labels in its dataset
export function determineMostLikelyLabel(data, labelName) {
  let labelMap = {};
  let maxCount = 0;
  for (let entry of data) {
    const label = entry[labelName];
    if (labelMap[label] == undefined) {
      labelMap[label] = 1;
    } else {
      labelMap[label] += 1;
    }
    maxCount = Math.max(maxCount, labelMap[label]);
  }

  for (const key in labelMap) {
    if (labelMap[key] === maxCount) return key;
  }
}

// Determines best split based on comparing gain ratios of all entries
export function determineBestSplit(
  dataLabels,
  continousMap,
  data,
  isGini,
  labelName
) {
  let currentHighestGainLabel = "";
  let currentHighestGain = 0.0;
  let currentThreshold = 0.0;

  for (let i = 0; i < dataLabels.length; i++) {
    const isCategorical = !continousMap.get(dataLabels[i]).get(0);
    const currGain = calculateGainRatio(
      dataLabels[i],
      continousMap,
      data,
      isGini,
      labelName
    );

    if (isCategorical && currGain > currentHighestGain) {
      currentHighestGain = currGain;
      currentHighestGainLabel = dataLabels[i];
    }
    if (!isCategorical && currGain.gainValue > currentHighestGain) {
      currentHighestGain = currGain.gainValue;
      currentHighestGainLabel = dataLabels[i];
      currentThreshold = currGain.threshold;
    }
  }
  return { currentHighestGainLabel, currentHighestGain, currentThreshold };
}

// Refer to practice exam 1 decision tree for algorithim.

// Calculates gain ratio from splitting on feature
function calculateGainRatio(feature, continousMap, data, isGini, labelName) {
  const isCategorical = !continousMap.get(feature).get(0);
  const gainInfo = calculateGain(
    feature,
    continousMap,
    data,
    isGini,
    labelName
  );
  const splitInfo = calculateSplitInfo(feature, data);
  if (isCategorical) {
    if (splitInfo === 0) return 0;
    return gainInfo / splitInfo;
  } else {
    if (splitInfo === 0) return 0;
    return {
      threshold: gainInfo.threshold,
      gainValue: gainInfo.gainValue / splitInfo
    };
  }
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
function calculateGain(feature, continousMap, data, isGini, labelName) {
  const isCategorical = !continousMap.get(feature).get(0);
  const overallImpurity = calculateImpurityValue(data, isGini, labelName);
  if (isCategorical) {
    return overallImpurity - calculateEntropy(feature, data, isGini);
  } else {
    const continousInfo = calculateEntropyContinous(
      feature,
      data,
      isGini,
      labelName
    );
    return {
      threshold: continousInfo.smallestEntropyThreshold,
      gainValue: overallImpurity - continousInfo.smallestEntropyValue
    };
  }
}

function calculateEntropyContinous(feature, data, isGini, labelName) {
  const sortedArray = data;
  sortedArray.sort((firstEntry, secondEntry) => {
    return firstEntry[feature] - secondEntry[feature];
  });

  let smallestEntropyValue = Number.MAX_SAFE_INTEGER;
  let smallestEntropyThreshold = -1;
  for (let i = 0; i < sortedArray.length - 1; i++) {
    const firstLabel = sortedArray[i][labelName];
    const secondLabel = sortedArray[i + 1][labelName];

    if (firstLabel !== secondLabel) {
      const potentialSplit =
        (sortedArray[i][feature] + sortedArray[i + 1][feature]) / 2.0;
      const potentialEntropyValue = calculateContinousEntropy(
        feature,
        sortedArray,
        potentialSplit,
        isGini,
        labelName
      );
      if (potentialEntropyValue < smallestEntropyValue) {
        smallestEntropyValue = potentialEntropyValue;
        smallestEntropyThreshold = potentialSplit;
      }
    }
  }

  return { smallestEntropyThreshold, smallestEntropyValue };
}

function calculateContinousEntropy(
  feature,
  sortedArray,
  potentialSplit,
  isGini,
  labelName
) {
  const leftHalf = sortedArray.filter(entry => {
    return entry[feature] <= potentialSplit;
  });
  const rightHalf = sortedArray.filter(entry => {
    return entry[feature] > potentialSplit;
  });

  return (
    (leftHalf.length / sortedArray.length) *
      calculateImpurityValue(leftHalf, isGini, labelName) +
    (rightHalf.length / sortedArray.length) *
      calculateImpurityValue(rightHalf, isGini, labelName)
  );
}

// Based on the currently given dataset, calculate the positive and negative
// counts. Can be used to calculate overall impurity of dataset or gini
// of specific features
export function calculateImpurityValue(data, isGini, labelName) {
  const labelMap = countLabels(data, labelName);

  return isGini
    ? getGiniCalculation(labelMap, data.length)
    : getEntropyCalculation(labelMap, data.length);
}

function getGiniCalculation(labelMap, dataLength) {
  let totalSquare = 0.0;

  for (const key in labelMap) {
    totalSquare += getSquaredNumber(labelMap[key], dataLength);
  }

  return 1.0 - totalSquare;
}

function getEntropyCalculation(labelMap, dataLength) {
  let totalCalc = 0.0;

  for (const key in labelMap) {
    const ratio = labelMap[key] / dataLength;
    totalCalc += ratio === 0 ? 0 : -(ratio * Math.log2(ratio));
  }

  return totalCalc;
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
export function getMap(feature, data, returnOnlyClassMap, isGini, labelName) {
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
        data.filter(entry => entry[feature] === classVal),
        isGini,
        labelName
      ),
      totalNum: classMap[classVal].totalCount
    };
    returnMap[classVal] = mapEntry;
  }

  return returnMap;
}

// Calculates split gini for feature (Maybe add entropy version of this later)?
function calculateEntropy(feature, data, isGini) {
  const featureMap = getMap(feature, data, false, isGini);
  let totalSplit = 0.0;

  for (let entry in featureMap) {
    const fractionValue = featureMap[entry].totalNum / data.length;
    totalSplit += fractionValue * featureMap[entry].impurityValue;
  }

  return totalSplit;
}

// Counts number of each label
function countLabels(data, labelName) {
  let labelMap = {};

  for (let entry of data) {
    const label = entry[labelName];
    if (labelMap[label] == undefined) {
      labelMap[label] = 1;
    } else {
      labelMap[label] += 1;
    }
  }

  return labelMap;
}
