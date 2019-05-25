import React from 'react'
import {ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts'
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

    generateRandomData(length=100, max=100) {

      let positiveDataNew = []
      let negativeDataNew = []

        for(let i =0; i < length; i++) {
          let randomX = Math.floor(Math.random() * max)
          let randomY = Math.floor(Math.random() * max)
          let randomZ = Math.floor(Math.random() * max)
          let entry = {x: randomX, y:randomY, z: randomZ}
           if(i % 2 === 0) {
              positiveDataNew.push(entry)
           } else {
              negativeDataNew.push(entry)
           }
        }

        this.setState({
          positiveData: positiveDataNew,
          negativeData: negativeDataNew,
          unlabeledData:[]
        })
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                     <ScatterChart width={1000} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name="x" domain={[0,100]}  />
                        <YAxis dataKey="y" name="y" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter name="Positive" data={this.state.positiveData} fill="#32CD32" />
                        <Scatter name="Negative" data={this.state.negativeData} fill="#FF0000" />
                    </ScatterChart>
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