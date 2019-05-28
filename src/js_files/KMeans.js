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

        this.state = {
            k: 2,
            clusterData: [{x: 0, y: 0}, {x: 100, y: 100}],
            centroidData: []
        }

    }

    smallClusterDrop(e, factor=3) {
        let xCoord = Math.floor((e.screenX - 150)/5.5)
        let yCoord = Math.floor(100 - (e.screenY - 209)/5.5)
        let newData = this.state.clusterData
        let cardinal = [[0, 0], [-1, 0], [0, -1], [1, 0],
                                 [0, 1], [1, 1], [-1, -1], [1, -1]
                                 [-1, 1]]

        for(let direction of cardinal) {
            newData.push({x: xCoord + direction[0] * factor, y: yCoord + direction[1] * factor})
        }

        this.setState({
            clusterData: newData
        })

    }

    render() {
        return(
            <div className="App">
              <div className="App-header">
              <XYPlot  width={600} height={600} onClick={(e) => this.smallClusterDrop(e)}>
                          <VerticalGridLines />
                          <HorizontalGridLines />
                          <XAxis />
                          <YAxis />
                          <MarkSeries
                            className="mark-series-example"
                            strokeWidth={2}
                            opacity="0.8"
                            sizeRange={[0, 100]}
                            data={this.state.clusterData}
                          />
                </XYPlot>
                <ButtonToolbar>
                    <Button>Start K Means</Button>
                </ButtonToolbar>
              </div>
            </div>
        )
    }

}


export default KMeans