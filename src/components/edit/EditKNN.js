import React from "react";
import {
  addLabelColor,
  deleteLabelColor,
  changeLabelColor
} from "../../actions/KNNActions";
import { Table, Image } from "react-bootstrap";
import Trash from "../../Images/trash.png";
import Add from "../../Images/add.png";
import { showBasicBackNavBar } from "../../Utility";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";

class EditKNN extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderColorWheel: this.generateFalseArray(this.props.labels.size),
      renderColorWheelAdd: false,
      addColor: ""
    };
  }

  generateFalseArray(size) {
    let toReturn = [];

    for (let i = 0; i < size; i++) {
      toReturn.push(false);
    }

    return toReturn;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header-low">
          {showBasicBackNavBar()}
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
                    <td
                      bgcolor={color}
                      onClick={() => {
                        let currWheel = this.state.renderColorWheel;
                        currWheel[index] = !currWheel[index];
                        this.setState({
                          renderColorWheel: currWheel
                        });
                      }}
                    ></td>
                    {this.state.renderColorWheel[index] ? (
                      <SketchPicker
                        color={this.props.labels.get(index)}
                        onChange={color =>
                          this.props.changeLabelColor(color.hex, index)
                        }
                      />
                    ) : null}
                    <td>
                      <input
                        type="text"
                        value={this.props.labels.get(index)}
                        onChange={e =>
                          this.props.changeLabelColor(e.target.value, index)
                        }
                      />
                    </td>
                    <td onClick={() => this.props.deleteLabelColor(color)}>
                      <Image src={Trash} className="small-photo" />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  onClick={() =>
                    this.setState({
                      renderColorWheelAdd: !this.state.renderColorWheelAdd
                    })
                  }
                >
                  Add Label
                </td>
                {this.state.renderColorWheelAdd ? (
                  <SketchPicker
                    onChange={color => this.setState({ addColor: color.hex })}
                  />
                ) : null}
                <td>
                  <input
                    type="text"
                    value={this.state.addColor}
                    onChange={e => this.setState({ addColor: e.target.value })}
                    placeholder="Enter hex color"
                  />
                </td>
                <tr>
                  <td
                    onClick={() =>
                      this.props.addLabelColor(this.state.addColor)
                    }
                  >
                    <Image src={Add} className="small-photo" />
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
  addLabelColor,
  deleteLabelColor,
  changeLabelColor
};

export default connect(mapStateToProps, mapDispatchToProps)(EditKNN);
