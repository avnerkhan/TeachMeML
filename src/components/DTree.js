/* eslint-disable */
import React from "react";
import Tree from "react-tree-graph";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import EditDTree from "./edit/EditDTree";
import {
  determineBestSplit,
  determineMostLikelyLabel,
  getGiniMap,
  filteredData,
  calculateGiniValue
} from "./algorithims/DTreeAlgo";
import "../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";

class DTree extends React.Component {
  constructor(props) {
    super(props);

    // State contains data. features are categorical, and label is last
    // Feature keys are ints so they are easily indexable
    this.state = {
      showMode: false,
      renderTree: false,
      renderTable: true,
      treeState: {},
      shownData: [],
      data: this.generateRandomDataState()
    };
  }

  // Filters data that is shown when the user presses a node on the tree
  presentData(name, data) {
    let toShowArr = [];

    for (let entry of data) {
      for (let key in entry) {
        if (entry[key] === name) {
          toShowArr.push(entry);
        }
      }
    }

    this.setState({
      shownData: toShowArr,
      showMode: true
    });
  }

  // Builds decision tree, with entropy as 0 as base case.
  buildTree(data, currTree, maxDepth = null, currDepth = 0) {
    if (maxDepth != null && currDepth >= maxDepth) {
      return currTree;
    }

    let entropy = calculateGiniValue(data);

    if (entropy === 0) {
      let dataClass = data[0].label;
      currTree.children.push({ name: dataClass, gProps: {} });
      return currTree;
    }

    let splitDict = {};
    const bestSplit = determineBestSplit(this.props.dataLabels, data);
    const splitIndex = this.props.dataLabels.findIndex(entry => {
      return entry === bestSplit;
    });
    const classArr = getGiniMap(splitIndex, data, true);

    for (const classVal in classArr) {
      splitDict[classVal] = filteredData(classVal, splitIndex, data);
    }

    for (const classVal in splitDict) {
      let name =
        classVal === "undefined" ? determineMostLikelyLabel(data) : classVal;
      let newNode = {
        name: name,
        gProps: {
          className: "custom",
          onMouseOver: () => this.presentData(name, data)
        },
        children: []
      };
      this.buildTree(splitDict[classVal], newNode, maxDepth, currDepth + 1);
      currTree.children.push(newNode);
    }

    return currTree;
  }

  // Method that allows the tree to be show and initializes/resets its state
  showTree() {
    this.setState({
      renderTree: true,
      treeState: this.buildTree(this.state.data, {
        name: "Start",
        gProps: { onMouseOver: () => this.setState({ showMode: false }) },
        children: []
      })
    });
  }

  // Adds a row to the dataset, copy of first row
  addRow() {
    const newData = this.state.data[0];
    let newState = this.state.data;
    newState.push(newData);

    this.setState({
      data: newState
    });
  }

  generateRandomDataState() {
    let dataState = [];
    let dataLabels = this.props.dataLabels;
    let labelClasses = this.props.labelClasses;

    for (let count = 0; count < 10; count++) {
      let entry = {};
      for (let i = 0; i < dataLabels.size; i++) {
        if (dataLabels.get(i) !== "label") {
          let currentClassLabels = labelClasses.get(dataLabels.get(i));
          let randomEntry = currentClassLabels.get(
            Math.floor(Math.random() * currentClassLabels.size)
          );
          entry[dataLabels.get(i)] = randomEntry;
        }
      }
      entry["label"] = count % 2;
      dataState.push(entry);
    }

    return dataState;
  }

  changeDataRow(e, key, dataIndex) {
    const data = this.state.data;
    data[dataIndex][key] = e.target.value;
    this.setState({
      data: data
    });
  }

  showSelectionForRow(value, key, dataIndex) {
    const valueClasses = this.props.labelClasses.get(key);

    return (
      <select
        value={value}
        onChange={e => this.changeDataRow(e, key, dataIndex)}
      >
        {valueClasses.map(entry => {
          return <option value={entry}>{entry}</option>;
        })}
      </select>
    );
  }

  deleteRow(dataIndex) {
    const data = this.state.data.filter((row, index) => {
      return index !== dataIndex;
    });
    this.setState({
      data: data
    });
  }

  showCustomDataTable() {
    console.log(this.state.data);
    return (
      <Table size="sm">
        <thead>
          <tr>
            {this.props.dataLabels.map(feature => {
              return <th>{feature}</th>;
            })}
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((dataRow, dataIndex) => {
            return (
              <tr>
                {Object.keys(dataRow).map((key, index) => {
                  return (
                    <td>
                      {this.showSelectionForRow(dataRow[key], key, dataIndex)}
                    </td>
                  );
                })}
                <td onClick={() => this.deleteRow(dataIndex)}>Delete</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  // Exit out of edit table page and go back to the tree generator page
  saveEditState() {
    this.setState({
      data: this.generateRandomDataState(),
      renderTable: true
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Row>
            {this.state.renderTree ? (
              <Tree
                height={400}
                width={800}
                data={this.state.treeState}
                svgProps={{ className: "custom" }}
              />
            ) : null}
            {this.state.renderTable ? (
              this.showCustomDataTable()
            ) : (
              <EditDTree />
            )}
          </Row>
          <ButtonToolbar>
            {this.state.renderTree || !this.state.renderTable ? null : (
              <Button onClick={() => this.showTree()}>Display</Button>
            )}
            {this.state.renderTable && !this.state.renderTree ? (
              <Button onClick={() => this.addRow()}>Add Row</Button>
            ) : null}
            {this.state.renderTable && !this.state.renderTree ? (
              <Button
                onClick={() =>
                  this.setState({ data: this.generateRandomDataState() })
                }
              >
                Randomize Data
              </Button>
            ) : null}
            {this.state.renderTable ? (
              <Button
                onClick={() =>
                  this.setState({ renderTree: false, renderTable: false })
                }
              >
                Edit Table Layout
              </Button>
            ) : (
              <Button onClick={() => this.saveEditState()}>Save State</Button>
            )}
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  dataLabels: state.DTree.dataLabels,
  labelClasses: state.DTree.labelClasses
});

export default connect(mapStateToProps)(DTree);