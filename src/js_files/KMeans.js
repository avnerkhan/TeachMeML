import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import {euclidFunction, comparator} from './Utility'
import '../css_files/App.css'
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';
import { isUndefined } from 'util';

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

        let unlabeledData = this.state.unlabeledData
        let centroidData = this.state.centroidData
        let clusterData = this.state.clusteredData

        for(let point of this.state.unlabeledData) {
            if(point !== undefined && !isNaN(point.x)) {
                let nearestMap = centroidData.map(centroid => euclidFunction(centroid, point))
                nearestMap.sort(comparator)
                let nearestCentroid = nearestMap[0].orginalPoint
                clusterData[centroidData.indexOf(nearestCentroid)].push(point)
                delete unlabeledData[unlabeledData.indexOf(point)]
            }
        }

        console.log(clusterData)

        this.setState({
            unlabeledData: unlabeledData,
            clusteredData: clusterData
        })
        
        
        
    }

    makeCentroid(datapoint) {

        let newCentroidState = this.state.centroidData
        let newUnlabeledData = this.state.unlabeledData
        let newClusterData = this.state.clusteredData
        newClusterData.push([])

        if(this.state.choosingCentroidState) {
            newCentroidState.push(datapoint)
            delete newUnlabeledData[newUnlabeledData.indexOf(datapoint)]
        }

        this.setState({
            centroidData: newCentroidState,
            unlabeledData: newUnlabeledData,
            clusteredData: newClusterData
        })


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
                          {this.state.clusteredData.map((cluster) => {
                                return(
                                    <MarkSeries
                                        className="mark-series-example"
                                        strokeWidth={2}
                                        opacity="0.8"
                                        sizeRange={[0, 100]}
                                        color={this.stateEnum.CLUSTER[this.state.clusteredData.indexOf(cluster)]}
                                        data={cluster}
                                    />
                                )
                            })}
                </XYPlot>
                <ButtonToolbar>
                    {this.state.readyToStartState ? <Button onClick={() => this.setState({choosingCentroidState: true, readyToStartState: false})}>Start K Means</Button> : null}
                    {this.state.choosingCentroidState ? <Button onClick={() => this.setState({choosingCentroidState: false, runningAlgorithimState: true})}>Done choosing centroids</Button> : null}
                    {this.state.runningAlgorithimState ? <Button onClick={() => this.runIteration()}>Run Next Iteration</Button> : null}
                </ButtonToolbar>
              </div>
            </div>
        )
    }

}


export default KMeans