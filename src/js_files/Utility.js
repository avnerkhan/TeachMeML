// Euclidean distance function that returns orginal point and distance
export function euclidFunction(pointOne, pointTwo) {


    let xDistance = pointOne.x - pointTwo.x 
    let yDistance = pointOne.y - pointTwo.y
    xDistance *= xDistance
    yDistance *= yDistance
    const totalDistance = Math.sqrt(xDistance + yDistance)
    return {orginalPoint: pointOne, distance: totalDistance}

  }

  // Comparator for KNN
  export function comparator(entryOne, entryTwo) {

    if(entryOne.distance < entryTwo.distance) {
      return -1 
    }
    if (entryOne.distance > entryTwo.distance) {
      return 1
    }

    return 0

  }


  export function arrayRange(lowerBound, upperBound) {
    return Array.from(new Array(upperBound), (x,i) => i + lowerBound)
  }