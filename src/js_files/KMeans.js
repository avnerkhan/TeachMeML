import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import '../css_files/App.css'

class KMeans extends React.Component {
    constructor(props) {
        super(props)

        this.stateEnum = {
            UNLABELED:  "#FFFFFF",
            CENTROID: "#000000",
            CLUSTER: ["#32CD32", "#FF6347", "#FFFF00", "#00FFFF", "#FFA500"]
        }

        this.state = {
            readyToStartState: false,
            choosingCentroidState: false,
            runningAlgorithimState: false,
            k: 2,
            unlabeledData: [{x: 0, y: 0}],
            clusteredData:[],
            centroidData: []
        }

    }

    smallClusterDrop(e, factor=3) {

        if(!this.state.choosingCentroidState && !this.state.runningAlgorithimState) {

            let xCoord = Math.floor((e.screenX - 460)/5.5)
            let yCoord = Math.floor(100 - (e.screenY - 209)/5.5)
            let newData = this.state.unlabeledData

            if(newData.length == 1) newData.shift()

            let cardinal = [[0, 0], [-1, 0], [0, -1], [1, 0],
                                    [0, 1], [1, 1], [-1, -1], [1, -1]
                                    [-1, 1]]

            for(let direction of cardinal) {
                newData.push({x: xCoord + direction[0] * factor, y: yCoord + direction[1] * factor})
            }

            this.setState({
                unlabeledData: newData,
                readyToStartState: true
            })

        }
        

    }

    runIteration() {
        
    }

    makeCentroid(datapoint) {

        console.log("GOT HERE")
        if(this.state.choosingCentroidState) {
            console.log(datapoint)
        }

    }

    render() {
        return(
            <div className="App">
              <div className="App-header">
              <XYPlot  width={600} height={600} onClick={(e) => this.smallClusterDrop(e)} xDomain={[0, 100]} yDomain={[0, 100]}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <XAxis />
                          <YAxis />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            color={this.stateEnum.UNLABELED}
                            data={this.state.unlabeledData}
                            onValueClick={(datapoint) => this.makeCentroid(datapoint)}
                          />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            color={this.stateEnum.CENTROID}
                            data={this.state.centroidData}
                          />
                </XYPlot>
                <ButtonToolbar>
                    {this.state.readyToStartState ? <Button onClick={() => this.setState({choosingCentroidState: true, readyToStartState: false})}>Start K Means</Button> : null}
                    {this.state.choosingCentroidState ? <Button onClick={() => this.setState({choosingCentroidState: false, runningAlgorithimState: true})}>Done choosing centroids</Button> : null}
                    {this.state.runningAlgorithimState ? <Button onClick={this.runIteration()}>Run Next Iteration</Button> : null}
                </ButtonToolbar>
              </div>
            </div>
        )
    }

}


export default KMeans