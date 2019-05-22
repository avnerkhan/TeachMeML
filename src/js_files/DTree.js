import React from "react"
import Tree from 'react-tree-graph'
import '../css_files/App.css'


class DTree extends React.Component {
    constructor(props) {
        super(props)
        this.myTreeData = {
          name: 'Root',
          children: [
            {
              name: "First"
            },
            {
              name: "Second"
            }
          ]
        }
    }
    render() {
        return(
            <div className="App">
              <div className="App-header">
                <Tree height = {200} width = {300} data={this.myTreeData}  />
              </div>
            </div>
                
        )
    }
}

export default DTree