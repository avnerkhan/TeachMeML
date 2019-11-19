import React from "react";
import {
  addLabelClass,
  deleteLabelClass,
  changeLabelColor
} from "../../actions/KNNActions";
import { Table, Image } from "react-bootstrap";
import Trash from "../../Images/trash.png";
import Add from "../../Images/add.png";
import { connect } from "react-redux";

class EditKNN extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          <Table size="sm">
            <thead>
              <tr>
                <th>Current Labels</th>
              </tr>
            </thead>
            <tbody>
              {this.props.labels.map((color, index) => {
                return (
                  <tr>
                    <td bgcolor={color}></td>
                    <td>
                      <input
                        type="text"
                        value={this.props.labels.get(index)}
                        onChange={e =>
                          this.props.changeLabelColor(e.target.value, index)
                        }
                      />
                    </td>
                    <td onClick={() => this.props.deleteLabelClass(color)}>
                      <Image src={Trash} style={{ width: 40 }} />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Add</td>
                <td>
                  <input type="text" ref="input" />
                </td>
                <tr>
                  <td
                    onClick={() =>
                      this.props.addLabelClass(this.refs["input"].value)
                    }
                  >
                    <Image src={Add} style={{ width: 40 }} />
                  </td>
                </tr>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.KNN.labels
});

const mapDispatchToProps = {
  addLabelClass,
  deleteLabelClass,
  changeLabelColor
};

export default connect(mapStateToProps, mapDispatchToProps)(EditKNN);
