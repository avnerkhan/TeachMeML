import React from "react"
import Tree from "react-d3-tree"
import '../css_files/App.css'


class DTree extends React.Component {
    constructor(props) {
        super(props)
        this.myTreeData = [
            {
              name: 'Top Level',
              attributes: {
                keyA: 'val A',
                keyB: 'val B',
                keyC: 'val C',
              },
              children: [
                {
                  name: 'Level 2: A',
                  attributes: {
                    keyA: 'val A',
                    keyB: 'val B',
                    keyC: 'val C',
                  },
                },
                {
                  name: 'Level 2: B',
                },
              ],
            },
          ]
    }
    render() {
        return(
            <div className="tree-container">
                <Tree data={this.myTreeData} />
            </div>
                
        )
    }
}

export default DTree