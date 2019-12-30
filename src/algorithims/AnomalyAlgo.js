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

export function getOutliers(partitions) {
  return partitions
    .filter(partition => partition.data.length === 1)
    .map(partition => partition.data[0]);
}
