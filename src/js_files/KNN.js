import React from 'react'
import {ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Legend} from 'recharts'
import '../css_files/App.css'

class KNN extends React.Component {
    constructor(props) {
        super(props)

        this.classData = [
            {
                "x": 200,
                "y": 260,
                "z": 240
              },
              {
                "x": 240,
                "y": 290,
                "z": 220
              },
              {
                "x": 190,
                "y": 290,
                "z": 250
              },
              {
                "x": 198,
                "y": 250,
                "z": 210
              },
              {
                "x": 180,
                "y": 280,
                "z": 260
              },
              {
                "x": 210,
                "y": 220,
                "z": 230
              }
        ]

    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                     <ScatterChart width={800} height={400} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name="stature" unit="cm" />
                        <YAxis dataKey="y" name="weight" unit="kg" />
                        <ZAxis dataKey="z" range={[64, 144]} name="score" unit="km" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter name="Class One" data={this.classData} />
                    </ScatterChart>
                </div>
            </div>
        )
    }
}


export default KNN