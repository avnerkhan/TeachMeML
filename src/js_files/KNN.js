import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import {euclidFunction, comparator, arrayRange} from './Utility'
import '../css_files/App.css'

class KNN extends React.Component {
    constructor(props) {
        super(props)

        this.stateEnum = {
          POSITIVE: "#32CD32",
          NEGATIVE: "#FF6347",
          UNLABELED: "#FFFFFF",
          HIGHLIGHT: "#FFFF00"
        }

        let randomData = this.generateRandomData()

        this.state = {
          k: 1,
          positiveData: randomData.positive,
          negativeData: randomData.negative,
          undeterminedData: [],
          currentHighlightData: []
        }


    }

    // Generates random points to put on plot, and clears undetermined points
    generateRandomData(length=100, max=100) {

        let newDataPositive = []
        let newDataNegative = []


        for(let i = 0; i < length; i++) {
          let randomX = Math.floor(Math.random() * max)
          let randomY = Math.floor(Math.random() * max)
          let entry = {x:randomX, y:randomY}

          if(i % 2 === 0) {
            newDataPositive.push(entry)
          } else {
            newDataNegative.push(entry)
          }
          
        }

        
        return {positive: newDataPositive, negative: newDataNegative}
    }



    // Adds an undetermined point to the grid
    addPoint(xCoord, yCoord) {

      xCoord = parseInt(xCoord)
      yCoord = parseInt(yCoord)

      if(!isNaN(xCoord) && !isNaN(yCoord)) {
        let updatedDataUndetermined = this.state.undeterminedData
        updatedDataUndetermined.push({x: xCoord, y: yCoord})

        this.setState({
          undeterminedData: updatedDataUndetermined
        })
      } else {
        alert("Please enter valid coordinates")
      }
      

      this.refs["xCoord"].value = ""
      this.refs["yCoord"].value = ""

    }


    // Labels data as either positive or negative based on the state array that
    // it orginally belongs to
    relabelData(point) {
      point["class"] = this.state.positiveData.includes(point) ? this.stateEnum.POSITIVE : this.stateEnum.NEGATIVE
      return point
    }

    // Returns JSX for showing the input for x and y
    showXandYInput() {
      return(
        <InputGroup>
          <FormControl ref="xCoord" placeholder="Enter X Coordinate"></FormControl>
          <FormControl ref="yCoord" placeholder="Enter Y Coordinate"></FormControl>
        </InputGroup>
      )
    }



    // Shows selectable values for K
    showKSelect() {
        return(
          <Form>
            <Form.Group>
              <Form.Label>Select K value</Form.Label>
              <Form.Control as="select" onChange={(e) => this.setState({k: e.target.value})}>
                {arrayRange(1, 10).map((num) => {
                  return(
                    <option value={num}>{num}</option>
                  )
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        )
    }


    // Highlights K on mouse over or determines point on click
    highlightK(datapoint, isChange) {

      let highlightPoints = []
      let newPositive = this.state.positiveData
      let newNegative = this.state.negativeData
      let newUnlabeled = this.state.undeterminedData
      let allData = this.state.positiveData.concat(this.state.negativeData)
      allData = allData.map(point => this.relabelData(point))
      let euclidMap = allData.map(point => euclidFunction(point, datapoint))
      euclidMap.sort(comparator)

      let positiveCount = 0
      for(let i = 0; i < this.state.k; i++) {
        highlightPoints.push(euclidMap[i].orginalPoint)
        positiveCount += euclidMap[i].orginalPoint.class === this.stateEnum.POSITIVE ? 1 : 0
      }

      if(isChange) {
        if(positiveCount >= (this.state.k/2)) {
          newPositive.push(datapoint)
        } else {
          newNegative.push(datapoint)
        }
        newUnlabeled.splice(newUnlabeled.indexOf(datapoint), 1)
        highlightPoints = []
      }

      this.setState({
        positiveData: newPositive,
        negativeData: newNegative,
        undeterminedData: newUnlabeled,
        currentHighlightData: highlightPoints
      })

    }

    generateRandomUndetermined(length=20, max=100) {

      for(let i = 0; i < length; i++) {
        let randomX = Math.floor(Math.random() * max)
        let randomY = Math.floor(Math.random() * max)
        this.addPoint(randomX, randomY)
      }

    }

    randomizeData() {
      let newRandomized = this.generateRandomData()

      this.setState({
        positiveData: newRandomized.positive,
        negativeData: newRandomized.negative
      })
    }


    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <XYPlot  width={600} height={600}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <XAxis />
                          <YAxis />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            color={this.stateEnum.POSITIVE}
                            data={this.state.positiveData}
                          />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            color={this.stateEnum.NEGATIVE}
                            data={this.state.negativeData}
                          />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            onValueMouseOut={() => this.setState({currentHighlightData: []})}
                            onValueMouseOver={(datapoint) => this.highlightK(datapoint, false)}
                            onValueClick={(datapoint) => this.highlightK(datapoint, true)}
                            color={this.stateEnum.UNLABELED}
                            data={this.state.undeterminedData}
                          />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            color={this.stateEnum.HIGHLIGHT}
                            data={this.state.currentHighlightData}
                          />
                    </XYPlot>
                    <ButtonToolbar>
                      <Button onClick={() => this.randomizeData()}>Generate Random Data</Button>
                      {this.state.positiveData.length > 0 ? <Button onClick={() => this.addPoint(this.refs["xCoord"].value, this.refs["yCoord"].value)}>Add Point</Button> : null}
                      {this.state.positiveData.length > 0 ? <Button onClick={() => this.generateRandomUndetermined()}>Generate Random Undetermined data</Button> : null}
                    </ButtonToolbar>
                    {this.state.positiveData.length > 0 ? this.showXandYInput() : null}
                    {this.state.undeterminedData.length > 0 ? this.showKSelect() : null}
                </div>
            </div>
        )
    }
}


export default KNN