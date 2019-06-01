import React from "react"
import Tree from 'react-tree-graph'
import ReactTable from 'react-table'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import '../css_files/App.css'
import 'react-table/react-table.css'


class DTree extends React.Component {
    constructor(props) {
        super(props)


        this.defaultLabels = ["Passed", "GPA", "Language"]
        this.defaultLabelClasses = {
          "passed": ["Yes", "No"],
          "gpa": ["4.0", "2.0"],
          "language": ["Python", "Java", "C++"],
          "label": [0, 1]
        }


        // State contains data. features are categorical, and label is last
        // Feature keys are ints so they are easily indexable
        this.state = {
          showMode: false,
          renderTree: false,
          renderTable:true,
          treeState: {},
          dataLabels: this.defaultLabels,
          shownData: [],
          data: this.generateRandomDataState(),
          labelClasses: this.defaultLabelClasses
        }



    }

    // Whenever an entry is clicked, we change the entry by iterating through
    // label array and set state to corresponding, as well as erasing the tree
    handleEdit(row, feature, index) {

      let copyState = this.state.data
      let indexer = feature === "label" ? feature : index
      const currentValue = copyState[row][indexer]
      const currentIndex = this.state.labelClasses[feature].indexOf(currentValue)
      const newIndex = (currentIndex + 1) % this.state.labelClasses[feature].length 
      copyState[row][indexer] = this.state.labelClasses[feature][newIndex]

      this.setState({
        renderTree: false,
        data: copyState,
        treeState:[],
        showMode:false
      })

      
    }





    // Converts data so that table creating library can read. Creates it into 
    // lowercase versions of data labels instead of indexes
    createTableReadableData(isOnShowMode) {

      const dataLabels = this.state.dataLabels
      const data = isOnShowMode ? this.state.shownData : this.state.data
      let newData = []

      console.log(data)

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

    // Filters data that is shown when the user presses a node on the tree
    presentData(name, data) {

      let toShowArr = []

      for (let entry of data) {
        for (let key in entry) {
          if(entry[key] === name) {
            toShowArr.push(entry)
          }
        }
      }

      this.setState({
        shownData: toShowArr,
        showMode:true
      })
      
    }

    // Builds decision tree, with entropy as 0 as base case. 
    buildTree(dataLabels, data, currTree, maxDepth=null, currDepth=0) {

      if(maxDepth != null && currDepth >= maxDepth) {
        return currTree
      }

      let entropy = this.calculateGiniValue(data)

      if (entropy === 0) {
        let dataClass = data[0].label
        currTree.children.push({name:dataClass, gProps:{}})
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
        let newNode = {name: name, gProps: {className: 'custom', onMouseOver:() => this.presentData(name, data)}, children: []}
        this.buildTree(dataLabels, splitDict[classVal], newNode, maxDepth, currDepth + 1)
        currTree.children.push(newNode)
      }

      return currTree

    }

    // For determing ties when a node has multiple labels in its dataset
    determineMostLikelyLabel(data) {

      let posLabelCount = 0

      for (let entry of data) {
        posLabelCount += entry.label === 1 ? 1 : 0
      }

      if(posLabelCount/data.length === 0.5) {
        return "1/0"
      }

      return posLabelCount/data.length > 0.5 ? 1 : 0 

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

    // Method that allows the tree to be show and initializes/resets its state
    showTree() {
      this.setState({
        renderTree: true,
        treeState: this.buildTree(this.state.dataLabels, this.state.data, {name: "Start", gProps:{onMouseOver:() => this.setState({showMode:false})} ,children:[]})
      })
    }


    // Dynamically generates columns for data table based on data labels in state
    generateColumns(dataLabels) {

      let columnsToReturn = []
      let copiedLabels = [...dataLabels]
      copiedLabels.push("Label")

      for (let i = 0; i < copiedLabels.length; i++) {

        const lastIndex = i 
        const featureName = copiedLabels[i].toLowerCase() 

        let entry = {
          Header: copiedLabels[i],
          accessor: copiedLabels[i].toLowerCase(),
          Cell: row => (
            <div onClick={() => this.handleEdit(row.index, featureName, lastIndex)}>
              {row.original[copiedLabels[i].toLowerCase()]}
            </div>
        )
        }

        columnsToReturn.push(entry)
      }

      return columnsToReturn

    }

    // Adds a row to the dataset, copy of first row
    addRow() {
      const newData = this.state.data[0]
      let newState = this.state.data
      newState.push(newData)

      this.setState({
        data:newState
      })
    }


    // Either deletes a class from feature or adds one
    changeClassFeatureState(modify, feature, isAdd) {

      if(modify !== "") {
        const featureLowerCase = feature.toLowerCase()
        let copyArr = this.state.labelClasses[featureLowerCase]

        if (isAdd) {
          copyArr.push(modify)
        } else {
          copyArr.splice(copyArr.indexOf(modify), 1)
        }
        let copyDict = this.state.labelClasses
        copyDict[featureLowerCase] = copyArr
        this.setState({
          labelClasses: copyDict
        })
      } else {
        alert("Please enter valid class name")
      }

        this.refs[feature].value = ""

    }

    // Either adds a new feature or deletes a current one
    changeFeatureState(feature, isAdd) {

      if(feature !== "") {
        let copyArr = this.state.dataLabels
        let copyClasses = this.state.labelClasses
        if (isAdd) {
          copyArr.push(feature)
          copyClasses[feature.toLowerCase()] = ["Sample"]
        } else {
          delete copyClasses[feature.toLowerCase()]
          copyArr.splice(copyArr.indexOf(feature), 1)
        }
        
        this.setState({
          dataLabels:copyArr,
          labelClasses: copyClasses
        })
      } else {
        alert("Please enter a valid feature name")
      }

      

      this.refs["newFeature"].value = ""

    }


    // Demonstrates current layout of table by dynamically generating JSX for state
    showCurrentLayout() {
      return(
        <Container>
          <Row>
          {this.state.dataLabels.map((feature) => {
                return(
                  <Col>
                    <Card className="black-text" style={{ width: '32rem'}}>
                    <Card.Header onClick={() => this.changeFeatureState(feature, false)}>{feature}</Card.Header>
                        <ListGroup>
                          {this.state.labelClasses[feature.toLowerCase()].map((className) => {
                            return(
                              <ListGroup.Item onClick={() => this.changeClassFeatureState(className, feature, false)}>{className}</ListGroup.Item>
                            )
                          })}
                          <InputGroup>
                            <FormControl ref={feature} placeholder="Enter new class name"></FormControl>
                            <InputGroup.Append>
                              <Button onClick={() => this.changeClassFeatureState(this.refs[feature].value, feature, true)}>Add New Class</Button>
                            </InputGroup.Append>
                          </InputGroup>
                        </ListGroup>
                    </Card>
                    </Col>
                )
              })}
            <Col>
            <InputGroup>
                    <FormControl ref="newFeature" placeholder="Enter new feature name"></FormControl>
                    <InputGroup.Append>
                      <Button onClick={() => this.changeFeatureState(this.refs["newFeature"].value, true)}>Add New Feature</Button>
                    </InputGroup.Append>
            </InputGroup>
            </Col>
          </Row>
        </Container>
      )
    }

    generateRandomDataState() {
      let dataState = []
      let dataLabels = this.state == undefined ? this.defaultLabels : this.state.dataLabels
      let labelClasses = this.state == undefined ? this.defaultLabelClasses : this.state.labelClasses
      console.log(dataLabels)
      console.log(labelClasses)

      for (let count = 0; count < 10; count++) {
        let entry = {}
        for (let i = 0; i < dataLabels.length; i++) {
          let currentClassLabels = labelClasses[dataLabels[i].toLowerCase()]
          let randomEntry = currentClassLabels[Math.floor(Math.random()*currentClassLabels.length)]
          entry[i] = randomEntry
        }
        entry["label"] = count % 2
        dataState.push(entry)
      }

      return dataState

      
    }

    // Exit out of edit table page and go back to the tree generator page
    saveEditState() {
      this.setState({
        data: this.generateRandomDataState(),
        renderTable: true
      })

    }


    render() {

        return(
            <div className="App">
              <div className="App-header">
                {this.state.renderTree ? <Tree height = {400} width = {800} data={this.state.treeState}  svgProps={{className: 'custom'}} /> : null}
                {this.state.renderTable ? <ReactTable data={this.createTableReadableData(this.state.showMode)} columns={this.generateColumns(this.state.dataLabels)} defaultPageSize={this.state.data.length} className="-striped -highlight"/> : this.showCurrentLayout()}
                <ButtonToolbar>
                  {this.state.renderTree || !this.state.renderTable ? null : <Button onClick={() => this.showTree()}>Display</Button>}
                  {this.state.renderTable && !this.state.renderTree ? <Button onClick={() => this.addRow()}>Add Row</Button> : null}
                  {this.state.renderTable && !this.state.renderTree ? <Button onClick={() => this.setState({data: this.generateRandomDataState()})}>Randomize Data</Button> : null}
                  {this.state.renderTable ? <Button onClick={() => this.setState({renderTree: false, renderTable:false})}>Edit Table Layout</Button> :  <Button onClick={() => this.saveEditState()}>Save State</Button>}
                </ButtonToolbar>
              </div>
            </div>
                
        )
    }
}

export default DTree
