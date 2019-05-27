import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import '../css_files/App.css'

class KNN extends React.Component {
    constructor(props) {
        super(props)

        this.stateEnum = {
          POSITIVE: 0,
          NEGATIVE: 50
        }

        this.state = {
          k: 3,
          data: [],
          undeterminedData: []
        }

    }

    // Generates random points to put on plot, and clears undetermined points
    generateRandomData(length=100, max=50) {

        let newData = []


        for(let i = 0; i < length; i++) {
          let randomX = Math.floor(Math.random() * max)
          let randomY = Math.floor(Math.random() * max)
          let color = i % 2 === 0 ? this.stateEnum.POSITIVE : this.stateEnum.NEGATIVE
          let entry = {x:randomX, y:randomY, color: color}
          newData.push(entry)
        }

        this.setState({
          data: newData,
          undeterminedData: []
        })
    }



    // Adds an undetermined point to the grid
    addPoint(xCoord, yCoord) {

      xCoord = parseInt(xCoord)
      yCoord = parseInt(yCoord)

      if(!isNaN(xCoord) && !isNaN(yCoord)) {
        let updatedData = this.state.data
        let updatedDataUndetermined = this.state.undeterminedData
        updatedData.push({x: xCoord, y: yCoord})
        updatedDataUndetermined.push({x: xCoord, y: yCoord})

        this.setState({
          data: updatedData,
          undeterminedData: updatedDataUndetermined
        })
      } else {
        alert("Please enter valid coordinates")
      }
      

      this.refs["xCoord"].value = ""
      this.refs["yCoord"].value = ""

    }

    // Euclidean distance function that returns orginal point and distance
    euclidFunction(pointOne, pointTwo) {

      let xDistance = pointOne.x - pointTwo.x 
      let yDistance = pointOne.y - pointTwo.y
      xDistance *= xDistance
      yDistance *= yDistance
      let totalDistance = Math.sqrt(xDistance + yDistance)
      return {orginalPoint: pointOne, distance: totalDistance}

    }

    // Comparator for KNN
    comparator(entryOne, entryTwo) {

      if(entryOne.distance < entryTwo.distance) {
        return -1 
      }
      if (entryOne.distance > entryTwo.distance) {
        return 1
      }

      return 0

    }

    // Runs algorithim for k-nearest, and adds new determined points to data
    // while clearing out undefined data
    runAlgorithim() {

      let newEntries =[]

      for(let undetermined of this.state.undeterminedData) {

        let euclidMap = this.state.data.map(point => this.euclidFunction(point, undetermined))
        euclidMap.sort(this.comparator)

        while(euclidMap[0].orginalPoint.color === undefined) {
          euclidMap.shift()
        }

        let positiveCount = 0

        for(let i = 0; i < this.state.k; i++) {
          positiveCount += euclidMap[i].orginalPoint.color === this.stateEnum.POSITIVE ? 1 : 0
        }

        let newLabel = positiveCount >= (this.state.k/2) ? this.stateEnum.POSITIVE : this.stateEnum.NEGATIVE
        let newEntry = {x: undetermined.x, y: undetermined.y, color: newLabel}
        newEntries.push(newEntry)

      }

      let newData = this.state.data.concat(newEntries)

      this.setState({
        data: newData,
        undeterminedData: []
      })





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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  return(
                    <option value={num}>{num}</option>
                  )
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        )
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                      <XYPlot  width={1000} height={500}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <XAxis />
                          <YAxis />
                          <MarkSeries
                            onNearestXY={(datapoint, e) => console.log(datapoint)}
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            data={this.state.data}
                          />
                    </XYPlot>
                    <ButtonToolbar>
                      <Button onClick={() => this.generateRandomData()}>Generate Random Data</Button>
                      {this.state.data.length > 0 ? <Button onClick={() => this.addPoint(this.refs["xCoord"].value, this.refs["yCoord"].value)}>Add Point</Button> : null}
                      {this.state.undeterminedData.length > 0 ? <Button onClick={() => this.runAlgorithim()}>Run Algorithim</Button> : null}
                    </ButtonToolbar>
                    {this.state.data.length > 0 ? this.showXandYInput() : null}
                    {this.state.undeterminedData.length > 0 ? this.showKSelect() : null}
                </div>
            </div>
        )
    }
}


export default KNN