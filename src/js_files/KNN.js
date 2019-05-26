import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import '../css_files/App.css'

class KNN extends React.Component {
    constructor(props) {
        super(props)

        this.colorEnum = {
          RED: 0,
          ORANGE: 50
        }

        this.state = {
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
          let color = i % 2 === 0 ? this.colorEnum.RED : this.colorEnum.ORANGE
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

      let updatedData = this.state.data
      let updatedDataUndetermined = this.state.undeterminedData
      updatedData.push({x: xCoord, y: yCoord})
      updatedDataUndetermined.push({x: xCoord, y: yCoord})

      this.setState({
        data: updatedData,
        undeterminedData: updatedDataUndetermined
      })

    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                      <XYPlot width={1000} height={500}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <XAxis />
                          <YAxis />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            data={this.state.data}
                          />
                    </XYPlot>
                    <ButtonToolbar>
                      <Button onClick={() => this.generateRandomData()}>Generate Random Data</Button>
                      <Button onClick={() => this.addPoint(this.refs["xCoord"].value, this.refs["yCoord"].value)}>Add Point</Button>
                      <Button>Run Algorithim</Button>
                    </ButtonToolbar>
                    <InputGroup>
                            <FormControl ref="xCoord" placeholder="Enter X Coordinate"></FormControl>
                            <FormControl ref="yCoord" placeholder="Enter Y Coordinate"></FormControl>
                    </InputGroup>
                </div>
            </div>
        )
    }
}


export default KNN