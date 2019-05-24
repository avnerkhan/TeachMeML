import React from "react"
import Tree from 'react-tree-graph'
import ReactTable from 'react-table'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import '../css_files/App.css'
import 'react-table/react-table.css'


class DTree extends React.Component {
    constructor(props) {
        super(props)

        // State contains data. features are categorical, and label is last
        // Feature keys are ints so they are easily indexable
        this.state = {
          renderTree: false,
          treeState: {},
          dataLabels: ["Passed", "GPA", "Language"],
          data: [
            {0: "No", 1: "4.0", 2: "Python", label: 1},
            {0: "No", 1: "2.0", 2: "Python", label: 0},
            {0: "Yes", 1: "4.0", 2: "C++", label: 1},
            {0: "Yes", 1: "2.0", 2: "Java", label: 1},
            {0: "Yes", 1: "4.0", 2: "Python", label: 0},
            {0: "No", 1: "2.0", 2: "C++", label: 0},
            {0: "Yes", 1: "4.0", 2: "Java", label: 1}
          ],
          columns: [
            {
              Header: "Passed",
              accessor: "passed",
              Cell: row => (
                <div onClick={() => this.handleEdit(row.index, 0)}>
                  {row.original.passed}
                </div>
            )
            },
            {
              Header: "GPA",
              accessor: "gpa",
              Cell: row => (
                <div onClick={() => this.handleEdit(row.index, 1)}>
                  {row.original.gpa}
                </div>
            )
            },
            {
              Header: "Language",
              accessor: "language",
              Cell: row => (
                <div onClick={() => this.handleEdit(row.index, 2)}>
                  {row.original.language}
                </div>
            )
            },
            {
              Header: "Label",
              accessor: "label",
              Cell: row => (
                <div onClick={() => this.handleEdit(row.index, 'label')}>
                    {row.original.label}
                </div>
            )
            }
          ]
        }


    }

    // Whenever an entry is clicked, we change the entry by iterating through
    // label array and set state to corresponding, as well as erasing the tree
    handleEdit(row, feature) {

      let copyState = this.state.data
      const labelArray = [
        ["Yes", "No"],
        ["4.0", "2.0"],
        ["Python", "Java", "C++"],
        [1, 0]
      ]

      let index = feature === "label" ? 3 : feature

      const currentValue = copyState[row][feature]
      const currentIndex = labelArray[index].indexOf(currentValue)
      const newIndex = (currentIndex + 1) % labelArray[index].length 
      copyState[row][feature] = labelArray[index][newIndex]
      this.setState({
        renderTree: false,
        data: copyState,
        treeState:[]
      })

      
    }





    // Converts data so that table creating library can read. Creates it into 
    // lowercase versions of data labels instead of indexes
    createTableReadableData() {

      const dataLabels = this.state.dataLabels

      const data = this.state.data

      let newData = []

      for (let entry of data) {
        let newEntry = {}
        for (let i = 0; i < dataLabels.length ; i++) {
          newEntry[dataLabels[i].toLowerCase()] = entry[i]
        }
        newEntry["label"] = entry.label
        newData.push(newEntry)
      }

      return newData

    }

    // Builds decision tree, with entropy as 0 as base case. 
    buildTree(dataLabels, data, currTree, maxDepth=null, currDepth=0) {

      if(maxDepth != null && currDepth >= maxDepth) {
        return currTree
      }

      let entropy = this.calculateGiniValue(data)

      if (entropy === 0) {
        let dataClass = data[0].label
        currTree.children.push({name:dataClass})
        return currTree
      }

      let splitDict = {}

      const bestSplit = this.determineBestSplit(dataLabels, data)



      const splitIndex = dataLabels.indexOf(bestSplit)


      const classArr = this.getGiniMap(splitIndex, data, true)

      for (const classVal in classArr) {
        splitDict[classVal] = this.filteredData(classVal, splitIndex, data)
        
      }

      

      for (const classVal in splitDict) {

        let name = classVal === "undefined" ? this.determineMostLikelyLabel(data) : classVal
        let newNode = {name: name, children: []}

        this.buildTree(dataLabels, splitDict[classVal], newNode, maxDepth, currDepth + 1)
        currTree.children.push(newNode)
      }

      return currTree



    }

    determineMostLikelyLabel(data) {
      let posLabelCount = 0

      for (let entry of data) {
        posLabelCount += entry.label === 1 ? 1 : 0
      }

      return posLabelCount/data.length >= 0.5 ? 1 : 0 
    }

    // Determines best split based on comparing gain ratios of all entries
    determineBestSplit(dataLabels, data) {
      let currentHighestGainLabel = ""
      let currentHighestGain = 0.0
      for (let i = 0; i < dataLabels.length; i++) {
        
        const currGain = this.calculateGainRatio(i, data)

        if (currGain > currentHighestGain) {
          currentHighestGain = currGain
          currentHighestGainLabel = dataLabels[i]
        }

      }



      return currentHighestGainLabel
    }


    // Refer to practice exam 1 decision tree for algorithim.

    // Calculates gain ratio from splitting on feature
    calculateGainRatio(feature, data) {

      const gain = this.calculateGain(feature, data)
      const splitInfo = this.calculateSplitInfo(feature, data)

      return gain/splitInfo
    }

    calculateSplitInfo(feature, data) {

      const giniMap = this.getGiniMap(feature, data, false)
      let totalSplit = 0.0

      for (const entry in giniMap) {
        const fraction = giniMap[entry].totalNum/data.length
        totalSplit += -fraction * Math.log2(fraction)
      }

      return totalSplit
      
    }

    // Calculates information gain from splitting on feature
    calculateGain(feature, data) {
      
      const overallEntropy = this.calculateGiniValue(data)

      const splitValue = this.calculateSplitGini(feature, data)

      return overallEntropy - splitValue

    }

    // Based on the currently given dataset, calculate the positive and negative
    // counts. Can be used to calculate overall entropy of dataset or gini
    // of specific features
    calculateGiniValue(data) {
      const posNegCount = this.countPositiveAndNegative(data)

      const posSquared = this.getSquaredNumber(posNegCount.pos, data.length)
      const negSquared = this.getSquaredNumber(posNegCount.neg, data.length)

      return 1 - posSquared - negSquared
    }


    // Returns a number divided by total dataset length and squares it
    getSquaredNumber(number, dataLength) {
      const ratio = number/dataLength
      return ratio * ratio
    }

    // Function that basically takes dataset, and creates one map that 
    // has all different classes for that feature, with class as a key,
    // and the value is the total count of that class and the positive count
    // The function then creates another map that has classes as keys and
    // has the values as the calculated gini of that class and the total count
    getGiniMap(feature, data, returnOnlyClassMap) {
      
      let classMap = {}
      let returnMap = {}

      console.log("Starts here")
      for (const entry of data) {
        const currentFeature = entry[feature]
        const positiveCount = entry.label
        if (classMap[currentFeature] == null) {
          classMap[currentFeature] = {totalCount: 1, posCount:positiveCount}
        } else {
          const currentTotalCount = classMap[currentFeature].totalCount
          const currentPositiveCount = classMap[currentFeature].posCount
          classMap[currentFeature] = {totalCount: currentTotalCount + 1, posCount:currentPositiveCount + positiveCount}
        }
      }

      console.log(data)
      console.log(classMap)

      if (returnOnlyClassMap) {
        return classMap
      }

      for (const classVal in classMap) {
        const mapEntry = {giniValue: this.calculateGiniValue(this.filteredData(classVal, feature, data)), totalNum: classMap[classVal].totalCount}
        returnMap[classVal] = mapEntry
      }

      return returnMap


    }

    // Filters data so that a new dataset is created for only that class
    // in a specific feature
    filteredData(classVal, feature, data) {
      let dataToReturn = []

      for (const entry of data) {
        if(entry[feature] === classVal) {
          dataToReturn.push(entry)
        }
      }


      return dataToReturn
    }

    // Calculates split gini for feature
    calculateSplitGini(feature, data) {

      const giniMap = this.getGiniMap(feature, data, false)
      let totalSplit = 0.0

      for (let entry in giniMap) {
        const fractionValue = giniMap[entry].totalNum/data.length
        totalSplit += fractionValue * giniMap[entry].giniValue
      }

      return totalSplit

    }

    // Counts number of negative and positive labels in a dataset
    countPositiveAndNegative(data) {

      let positiveCount = 0
      let negativeCount = 0

      for (let entry of data) {
        const label = entry.label
        if (label === 1) {
          positiveCount++
        }
        else {
          negativeCount++
        }
      }

      return {pos: positiveCount, neg: negativeCount}

    }

    showTree() {
      this.setState({
        renderTree: true,
        treeState: this.buildTree(this.state.dataLabels, this.state.data, {name: "Start", children:[]})
      })
    }

    addRow() {
      const newData = {0: "No", 1: "4.0", 2: "Python", label: 1}
      let newState = this.state.data
      newState.push(newData)

      this.setState({
        data:newState
      })
    }


    render() {

        return(
            <div className="App">
              <div className="App-header">
                {this.state.renderTree ? <Tree height = {400} width = {800} data={this.state.treeState} animated svgProps={{className: 'custom'}} /> : null}
                <ReactTable data={this.createTableReadableData()} columns={this.state.columns} defaultPageSize={this.state.data.length} className="-striped -highlight"/>
                <ButtonToolbar>
                  {this.state.renderTree ? null : <Button onClick={() => this.showTree()}>Display</Button>}
                  <Button onClick={() => this.addRow()}>Add Row</Button>
                  <Button>Edit Table Layout</Button>
                  {this.state.renderTree ? <Button>Show Steps</Button> : null}
                </ButtonToolbar>
              </div>
            </div>
                
        )
    }
}

export default DTree
