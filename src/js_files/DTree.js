import React from "react"
import Tree from 'react-tree-graph'
import '../css_files/App.css'


class DTree extends React.Component {
    constructor(props) {
        super(props)

        // State contains data. features are categorical, and label is last
        // Feature keys are ints so they are easily indexable
        this.state = {
          data: [
            {0: "A", 1: "B", 2: "C", 3: "Python", label: 1},
            {0: "B", 1: "C", 2: "D", 3: "Python", label: 0},
            {0: "B", 1: "C", 2: "D", 3: "C++", label: 1},
            {0: "B", 1: "C", 2: "D", 3: "Java", label: 1},
            {0: "B", 1: "C", 2: "D", 3: "Python", label: 0},
            {0: "B", 1: "C", 2: "D", 3: "C++", label: 0},
            {0: "B", 1: "C", 2: "D", 3: "Java", label: 1}
          ],
          treeState: {
            name: 'Root',
            children: [
              {
                name: "First"
              },
              {
                name: "Second"
              }
            ]
          }
        }

  

    }


    // Refer to practice exam 1 decision tree for algorithim.

    // Calculates gain ratio from splitting on feature
    calculateGainRatio(feature, data) {

      const gain = this.calculateGain(feature, data)
      const splitInfo = this.calculateSplitInfo(feature, data)

      return gain/splitInfo
    }

    calculateSplitInfo(feature, data) {




      
    }

    // Calculates information gain from splitting on feature
    calculateGain(feature, data) {
      
      let overallEntropy = this.calculatGiniValue(data)

      let splitValue = this.calculateSplitGini(data)

      return overallEntropy - splitValue

    }

    // Based on the currently given dataset, calculate the positive and negative
    // counts. Can be used to calculate overall entropy of dataset or gini
    // of specific features
    calculateGiniValue(data) {
      let posNegCount = this.countPositiveAndNegative(data)

      let posSquared = this.getSquaredNumber(posNegCount.pos, data.length)
      let negSquared = this.getSquaredNumber(posNegCount.neg, data.length)

      return 1 - posSquared - negSquared
    }


    // Returns a number divided by total dataset length and squares it
    getSquaredNumber(number, dataLength) {
      let ratio = number/dataLength
      return ratio * ratio
    }

    // Function that basically takes dataset, and creates one map that 
    // has all different classes for that feature, with class as a key,
    // and the value is the total count of that class and the positive count
    // The function then creates another map that has classes as keys and
    // has the values as the calculated gini of that class and the total count
    getGiniMap(feature, data) {
      
      let classMap = {}
      let returnMap = {}

      for (let entry of data) {
        let currentFeature = entry[feature]
        let positiveCount = entry.label
        if (classMap[currentFeature] == null) {
          classMap[currentFeature] = {totalCount: 1, posCount:positiveCount}
        } else {
          let currentTotalCount = classMap[currentFeature].totalCount
          let currentPositiveCount = classMap[currentFeature].posCount
          classMap[currentFeature] = {totalCount: currentTotalCount + 1, posCount:currentPositiveCount + positiveCount}
        }
      }

      for (let classVal in classMap) {
        let mapEntry = {giniValue: this.calculateGiniValue(this.filteredData(classVal, feature, data)), totalNum: classMap[classVal].totalCount}
        returnMap[classVal] = mapEntry
      }

      return returnMap


    }

    // Filters data so that a new dataset is created for only that class
    // in a specific feature
    filteredData(classVal, feature, data) {
      let dataToReturn = []

      for (let entry of data) {
        if(entry[feature] === classVal) {
          dataToReturn.push(entry)
        }
      }


      return dataToReturn
    }

    // Calculates split gini for feature
    calculateSplitGini(feature, data) {

      let giniMap = this.getGiniMap(feature, data)
      let totalSplit = 0.0

      for (let entry in giniMap) {
        let fractionValue = giniMap[entry].totalNum/data.length
        totalSplit += fractionValue * giniMap[entry].giniValue
      }

      return totalSplit

    }

    // Counts number of negative and positive labels in a dataset
    countPositiveAndNegative(data) {

      let positiveCount = 0
      let negativeCount = 0

      for (let entry of data) {
        let label = entry.label
        if (label === 1) {
          positiveCount++
        }
        else {
          negativeCount++
        }
      }

      return {pos: positiveCount, neg: negativeCount}

    }



    render() {
        return(
            <div className="App">
              <div className="App-header">
                <Tree height = {200} width = {300} data={this.state.treeState} svgProps={{className: 'custom'}} />
              </div>
            </div>
                
        )
    }
}

export default DTree