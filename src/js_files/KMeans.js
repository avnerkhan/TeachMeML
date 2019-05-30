import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Form from 'react-bootstrap/Form'
import {euclidFunction, comparator} from './Utility'
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
            spacing: 1,
            pointNum: 1,
            readyToStartState: false,
            choosingCentroidState: false,
            runningAlgorithimState: false,
            unlabeledData: [{x: 0, y: 0}],
            clusteredData:[],
            centroidData: []
        }

    }

    // Allows user to add a small cluster unlabeled points for later labeling
    smallClusterDrop(e) {

        if(!this.state.choosingCentroidState && !this.state.runningAlgorithimState) {


            let factor = this.state.spacing
            let numberPoints = this.state.pointNum
            let xCoord = Math.floor((e.screenX - 460)/5.5)
            let yCoord = Math.floor(100 - (e.screenY - 209)/5.5)
            let newData = this.state.unlabeledData

            if(newData.length === 1) newData.shift()

            let cardinal = [[0, 0], [-1, 0], [0, -1], [1, 0],
                            [0, 1], [1, 1], [-1, -1], [1, -1]
                            [-1, 1]]

            for(let i = 0; i < numberPoints; i++) {
                let direction = cardinal[i]
                newData.push({x: xCoord + direction[0] * factor, y: yCoord + direction[1] * factor})
            }

            this.setState({
                unlabeledData: newData,
                readyToStartState: true
            })

        }
        

    }


    // Runs an iteration of K means. Either determines centroid or labels data
    // based on current centroid
    runIteration() {

        let centroidData = this.state.centroidData
        let clusterData = this.state.clusteredData
        let unlabeledData = this.state.unlabeledData


        if(unlabeledData.length > 0) {
            for(let point of this.state.unlabeledData) {
                if(point !== undefined && !isNaN(point.x)) {
                    let nearestMap = centroidData.map(centroid => euclidFunction(centroid, point))
                    nearestMap.sort(comparator)
                    let nearestCentroid = nearestMap[0].orginalPoint
                    clusterData[centroidData.indexOf(nearestCentroid)].push(point)
                }
            }

            this.setState({
                unlabeledData: [],
                clusteredData: clusterData
            })
        } else {
            

            for(let count = 0; count < clusterData.length; count++) {
                let cluster = clusterData[count]
                let xAvg = 0.0
                let yAvg = 0.0

                for(let point of cluster) {
                    xAvg += point.x
                    yAvg += point.y
                    unlabeledData.push(point)
                }

                xAvg = xAvg/cluster.length
                yAvg = yAvg/cluster.length

                let newCentroid = {x: xAvg, y: yAvg}
                centroidData[count] = newCentroid
                clusterData[count] = []
            }

            this.setState({
                centroidData: centroidData,
                clusterData: clusterData,
                unlabeledData: unlabeledData
            })
            

        }

        
        
        
        
    }

    // Allows a user click on a point to become a centroid
    makeCentroid(datapoint) {

        if(this.state.centroidData.length < 5 && this.state.choosingCentroidState) {
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
        } else if(!this.state.choosingCentroidState) {
            alert("K Means not running, do not choose centroid")
        }
        else {
            alert("Cannot have more than 5 clusters.")
        }
    
    }

    // Clears data and state
    clearSlate() {
        this.setState({
                readyToStartState: false,
                choosingCentroidState: false,
                runningAlgorithimState: false,
                unlabeledData: [{x: 0, y: 0}],
                clusteredData:[],
                centroidData: []
            })
    }

    showClusterDeploymentSelection() {
        return(
            <Form>
            <Form.Group>
              <Form.Label>Select Cluster Spacing value</Form.Label>
              <Form.Control as="select" onChange={(e) => this.setState({spacing: e.target.value})}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  return(
                    <option value={num}>{num}</option>
                  )
                })}
              </Form.Control>
              <Form.Label>Select Cluster Points</Form.Label>
              <Form.Control as="select" onChange={(e) => this.setState({pointNum: e.target.value - 1})}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
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
                    {!this.state.choosingCentroidState && !this.state.runningAlgorithimState ? this.showClusterDeploymentSelection() : null}
                    {this.state.readyToStartState ? <Button onClick={() => this.setState({choosingCentroidState: true, readyToStartState: false})}>Start K Means</Button> : null}
                    {this.state.choosingCentroidState ? <Button onClick={() => this.setState({choosingCentroidState: false, runningAlgorithimState: true})}>Done choosing centroids</Button> : null}
                    {this.state.runningAlgorithimState ? <Button onClick={() => this.runIteration()}>Run Next Iteration</Button> : null}
                    {this.state.runningAlgorithimState ? <Button onClick={() => this.clearSlate()}>Restart Algorithim</Button> : null}
                </ButtonToolbar>
              </div>
            </div>
        )
    }

}


export default KMeans