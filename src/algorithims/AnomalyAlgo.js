import { truncate } from "fs";

//Partition Structure
/*
     {
       data: [{x, y}],
       afterX: 0
       afterY: 0
       beforeX: 100
       beforeY: 100
     }

     Whenever we add a new line, we look at our current partitons and deterime if this new
     line affects the given partition. If it does, then we make this into two new partions and remove the current partitions
     otherwise we just leave it the same
    
    */

export function getPartitions(partitions, newLine, data) {
  if (partitions.length === 0) {
    return [
      { data: [...data], aboveX: 0, aboveY: 0, belowX: 100, belowY: 100 }
    ];
  }
  let newPartitions = [];
  for (const partition of partitions) {
    if (
      newLine.x != undefined &&
      (newLine.x <= partition.afterX || newLine.x >= partition.belowX)
    ) {
      newPartitions.push(partition);
      continue;
    }
    if (
      newLine.y != undefined &&
      (newLine.y <= partition.afterY || newLine.y >= partition.belowY)
    ) {
      newPartitions.push(partition);
      continue;
    }
    if (newLine.x != undefined) {
      const leftPartition = {
        data: partition.data.filter(point => {
          return point.x < newLine.x;
        }),
        belowX: newLine.x,
        aboveX: partition.aboveX,
        belowY: partition.belowY,
        aboveY: partition.aboveY
      };

      const rightPartition = {
        data: partition.data.filter(point => {
          return point.x >= newLine.x;
        }),
        belowX: partition.belowX,
        aboveX: newLine.x,
        belowY: partition.belowY,
        aboveY: partition.aboveY
      };
      newPartitions.push(leftPartition);
      newPartitions.push(rightPartition);
      continue;
    }
    if (newLine.y != undefined) {
      const leftPartition = {
        data: partition.data.filter(point => {
          return point.y < newLine.y;
        }),
        belowX: partition.belowX,
        aboveX: partition.aboveX,
        belowY: newLine.y,
        aboveY: partition.aboveY
      };

      const rightPartition = {
        data: partition.data.filter(point => {
          return point.y >= newLine.y;
        }),
        belowX: partition.belowX,
        aboveX: partition.aboveX,
        belowY: partition.belowY,
        aboveY: newLine.y
      };
      newPartitions.push(leftPartition);
      newPartitions.push(rightPartition);
    }
  }
  return newPartitions;
}

function inCurrentOutliers(candidate, currentOutliers) {
  for (const point of currentOutliers) {
    if (point.x === candidate.data[0].x && point.y === candidate.data[0].y)
      return true;
  }
  return false;
}

export function getOutliers(partitions, iterCount, currentOutliers) {
  let newOutliers = [...currentOutliers];
  const strippedList = partitions.filter(
    partition => partition.data.length === 1
  );
  for (const candidate of strippedList) {
    if (!inCurrentOutliers(candidate, currentOutliers)) {
      newOutliers.push({
        x: candidate.data[0].x,
        y: candidate.data[0].y,
        iterCount
      });
    }
  }
  return newOutliers;
}
