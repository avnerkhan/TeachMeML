import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import '../css_files/App.css'

class KNN extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          positiveData: [],
          negativeData: []
        }

    }

    generateRandomData(length=100, max=50) {

        let newData = []

        for(let i = 0; i < length; i++) {
          let randomX = Math.floor(Math.random() * max)
          let randomY = Math.floor(Math.random() * max)
          let color = i % 2 === 0 ? 0 : 50
          let entry = {x:randomX, y:randomY, color: color}
          newData.push(entry)
        }

        this.setState({
          data: newData
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
                      <Button>Add Point</Button>
                      <Button>Run Algorithim</Button>
                    </ButtonToolbar>
                </div>
            </div>
        )
    }
}


export default KNN