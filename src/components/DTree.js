/* eslint-disable */
import React from "react";
import Tree from "react-tree-graph";
import Shuffle from "../Images/shuffle.png";
import Edit from "../Images/edit.png";
import Icon from "../Images/icon.png";
import Save from "../Images/save.png";
import Back from "../Images/back.png";
import Add from "../Images/add.png";
import Trash from "../Images/trash.png";
import { Image, Navbar, Nav, Table, Row, Col } from "react-bootstrap";
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
import { Link } from "react-router-dom";
import { displayInfoButton } from "../Utility";

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
      data: this.generateRandomDataState(),
      currentHighlight: null,
      shownData: [],
      shownEntropy: 0.0,
      shownGain: 0.0
    };
  }

  determineClassLabel(classVal) {
    for (const key of this.props.labelClasses.keySeq()) {
      if (this.props.labelClasses.get(key).contains(classVal)) return key;
    }
  }

  presentData(shownData, classVal, entropy, highestGainInfo) {
    this.setState({
      shownData: shownData,
      currentHighlight: this.determineClassLabel(classVal),
      shownEntropy: entropy,
      shownGain: highestGainInfo
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

    const information = determineBestSplit(this.props.dataLabels, data);
    const bestSplit = information.currentHighestGainLabel;
    const gainAmount = information.currentHighestGain;
    const classArr = getGiniMap(bestSplit, data, true);

    for (const classVal in classArr) {
      splitDict[classVal] = filteredData(classVal, bestSplit, data);
    }

    for (const classVal in splitDict) {
      let name =
        classVal === "undefined" ? determineMostLikelyLabel(data) : classVal;
      let newNode = {
        name: name,
        gProps: {
          className: "custom",
          onClick: () =>
            this.presentData(splitDict[classVal], classVal, entropy, gainAmount)
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

  showCustomDataTable(showNormalMode = true) {
    const tableToShow = showNormalMode ? this.state.data : this.state.shownData;
    const shownHighlights = this.state.currentHighlight;

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
          {tableToShow.map((dataRow, dataIndex) => {
            return (
              <tr>
                {Object.keys(dataRow).map((key, index) => {
                  return (
                    <td
                      bgcolor={
                        !showNormalMode &&
                        this.props.dataLabels.get(index) === shownHighlights
                          ? "#FFFF00"
                          : ""
                      }
                    >
                      {showNormalMode
                        ? this.showSelectionForRow(dataRow[key], key, dataIndex)
                        : dataRow[key]}
                    </td>
                  );
                })}
                {showNormalMode ? (
                  <td onClick={() => this.deleteRow(dataIndex)}>
                    <Image src={Trash} style={{ width: 40 }} />
                  </td>
                ) : null}
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

  displayTreeInformation() {
    return this.state.renderTree ? (
      <Row>
        <Col>
          {displayInfoButton(
            "Decision Tree",
            "This is the Decision Tree generated from the previous data, when you press a node, the column that this data splitted on is highlighted, as well the data that was split on that node.",
            "right"
          )}
          <Tree
            height={400}
            width={700}
            data={this.state.treeState}
            svgProps={{ className: "custom" }}
          />
        </Col>
        <Col>
          {displayInfoButton(
            "Data Split Table",
            "When you press a node, the column that this data splitted on is highlighted, as well the data that was split on that node.",
            "left"
          )}
        </Col>
        <Col>{this.showCustomDataTable(false)}</Col>
        <Col>
          <Row>Entropy: {this.state.shownEntropy}</Row>
          <Row>Gain: {this.state.shownGain}</Row>
        </Col>
      </Row>
    ) : null;
  }

  displayEditTableInformation() {
    return this.state.renderTable ? (
      !this.state.renderTree ? (
        this.showCustomDataTable()
      ) : null
    ) : (
      <EditDTree />
    );
  }

  showDisplayButton() {
    return this.state.renderTree || !this.state.renderTable ? null : (
      <Nav.Link onClick={() => this.showTree()}>Generate Tree</Nav.Link>
    );
  }

  showAddRowButton() {
    return this.state.renderTable && !this.state.renderTree ? (
      <Nav.Link onClick={() => this.addRow()}>
        <Image src={Add} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showRandomizeDataButton() {
    return this.state.renderTable && !this.state.renderTree ? (
      <Nav.Link
        onClick={() => this.setState({ data: this.generateRandomDataState() })}
      >
        <Image src={Shuffle} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showRenderTableButton() {
    return this.state.renderTable ? (
      <Nav.Link
        onClick={() => this.setState({ renderTree: false, renderTable: false })}
      >
        <Image src={Edit} style={{ width: 40 }} />
      </Nav.Link>
    ) : (
      <Nav.Link onClick={() => this.saveEditState()}>
        <Image src={Save} style={{ width: 40 }} />
      </Nav.Link>
    );
  }

  showBackToDataButton() {
    return this.state.renderTree || !this.state.renderTable ? (
      <Nav.Link
        onClick={() => this.setState({ renderTree: false, renderTable: true })}
      >
        <Image src={Back} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showBackToAlgorithimPage() {
    return this.state.renderTable && !this.state.renderTree ? (
      <Link to="/">
        <Nav>
          <Image src={Back} style={{ width: 40 }} />
        </Nav>
      </Link>
    ) : null;
  }

  showDecisionTreeNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {this.showBackToAlgorithimPage()}
        {this.showBackToDataButton()}
        {this.showDisplayButton()}
        {this.showAddRowButton()}
        {this.showRandomizeDataButton()}
        {this.showRenderTableButton()}
      </Navbar>
    );
  }

  showInformationBar() {
    return this.state.renderTable && !this.state.renderTree ? (
      <Col>
        {displayInfoButton(
          "Data Info Table",
          "This data is the data we use to generate our decision tree. You can change the values on each column on each row, delete rows with the trashcan, randomize data with the shuffle button.",
          "left"
        )}
      </Col>
    ) : null;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showDecisionTreeNavBar()}
          <Row>
            {this.showInformationBar()}
            <Col>
              {this.displayTreeInformation()}
              {this.displayEditTableInformation()}
            </Col>
          </Row>
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
