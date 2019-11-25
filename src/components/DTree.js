/* eslint-disable */
import React from "react";
import Tree from "react-tree-graph";
import Shuffle from "../Images/shuffle.png";
import Back from "../Images/back.png";
import Add from "../Images/add.png";
import SomeTree from "../Images/SomeTree.png";
import Trash from "../Images/trash.png";
import {
  Image,
  Navbar,
  Nav,
  Table,
  Row,
  Col,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import {
  determineBestSplit,
  determineMostLikelyLabel,
  getMap,
  calculateImpurityValue
} from "./algorithims/DTreeAlgo";
import "../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";
import {
  displayInfoButton,
  showBackToAlgorithimPage,
  roundToTwoDecimalPlaces
} from "../Utility";

class DTree extends React.Component {
  constructor(props) {
    super(props);

    // State contains data. features are categorical, and label is last
    // Feature keys are ints so they are easily indexable
    this.state = {
      isGini: true,
      renderTree: false,
      showFirstPage: true,
      displayedDepth: -1,
      treeState: {},
      data: this.generateRandomDataState(),
      currentHighlight: null,
      shownData: [],
      shownEntropy: 0.0,
      shownGain: 0.0
    };
  }

  determineClassLabel(classVal) {
    for (const key of this.props.featureClasses.keySeq().toArray()) {
      if (this.props.featureClasses.get(key).contains(classVal)) return key;
    }
  }

  presentData(shownData, classVal, entropy, highestGainInfo, currDepth) {
    this.setState({
      displayedDepth: currDepth,
      shownData: shownData,
      currentHighlight: this.determineClassLabel(classVal),
      shownEntropy: entropy,
      shownGain: highestGainInfo
    });
  }

  findInCategorical(classVal) {
    for (const key of this.props.featureClasses.keySeq().toArray()) {
      const classList = this.props.featureClasses.get(key);
      for (const classLabel of classList) {
        if (classLabel === classVal) return true;
      }
    }

    for (const label of this.props.labelClasses) {
      if (label === classVal) return true;
    }

    return false;
  }

  // Builds decision tree, with entropy as 0 as base case.
  buildTree(
    data,
    currTree,
    maxDepth = this.props.featureClasses.size + 1,
    currDepth = 0
  ) {
    if (maxDepth != null && currDepth >= maxDepth) {
      return currTree;
    }

    let entropy = calculateImpurityValue(
      data,
      this.state.isGini,
      this.props.label
    );

    if (entropy === 0) {
      let dataClass = data[0][this.props.label];
      currTree.children.push({ name: dataClass, gProps: {} });
      return currTree;
    }

    let splitDict = {};

    const information = determineBestSplit(
      this.props.featureClasses.keySeq().toArray(),
      this.props.continousClasses,
      data,
      this.state.isGini,
      this.props.label
    );
    const bestSplit = information.currentHighestGainLabel;
    const gainAmount = information.currentHighestGain;
    const threshold = information.currentThreshold;
    const classArr = getMap(
      bestSplit,
      data,
      true,
      this.state.isGini,
      this.props.label
    );

    for (const classVal in classArr) {
      splitDict[classVal] = data.filter(entry => entry[bestSplit] === classVal);
    }

    for (const classVal in splitDict) {
      const isCategorical = this.findInCategorical(classVal);
      let name =
        classVal == "undefined"
          ? determineMostLikelyLabel(data, this.props.label)
          : isCategorical
          ? classVal
          : threshold;

      if (isCategorical || classVal == "undefined") {
        let newNode = {
          name: name,
          gProps: {
            className: "custom",
            onClick: () =>
              this.presentData(
                splitDict[classVal],
                classVal,
                entropy,
                gainAmount,
                currDepth
              )
          },
          heldData: splitDict[classVal],
          children: []
        };
        this.buildTree(splitDict[classVal], newNode, maxDepth, currDepth + 1);
        currTree.children.push(newNode);
      } else {
        const lessThanHalf = data.filter(entry => entry[bestSplit] < threshold);
        const moreThanHalf = data.filter(
          entry => entry[bestSplit] >= threshold
        );
        let newNodeLess = {
          name: "<" + name,
          gProps: {
            className: "custom",
            onClick: () =>
              this.presentData(
                lessThanHalf,
                classVal,
                entropy,
                gainAmount,
                currDepth
              )
          },
          heldData: lessThanHalf,
          children: []
        };
        let newNodeMore = {
          name: ">=" + name,
          gProps: {
            className: "custom",
            onClick: () =>
              this.presentData(
                moreThanHalf,
                classVal,
                entropy,
                gainAmount,
                currDepth
              )
          },
          heldData: moreThanHalf,
          children: []
        };
        this.buildTree(lessThanHalf, newNodeLess, maxDepth, currDepth + 1);
        this.buildTree(moreThanHalf, newNodeMore, maxDepth, currDepth + 1);
        currTree.children.push(newNodeLess);
        currTree.children.push(newNodeMore);
      }
    }

    return currTree;
  }

  isContinous(childrenNodes) {
    for (const child of childrenNodes) {
      if (child.name.includes("<") || child.name.includes(">=")) return true;
    }
    return false;
  }

  refineTree(unrefinedTree) {
    if (this.isContinous(unrefinedTree.children)) {
      const moreThanHeldData = unrefinedTree.children
        .filter(child => {
          return child.name.includes(">=");
        })
        .map(entries => {
          return entries.heldData;
        });
      const lessThanHeldData = unrefinedTree.children
        .filter(child => {
          return child.name.includes("<");
        })
        .map(entries => {
          return entries.heldData;
        });
      // Finish later
    }
    for (let i = 0; i < unrefinedTree.children.length; i++) {
      unrefinedTree.children[i] = this.refineTree(unrefinedTree.children[i]);
    }
    return unrefinedTree;
  }

  // Method that allows the tree to be show and initializes/resets its state
  showTree() {
    const unrefinedTree = this.buildTree(this.state.data, {
      name: "Start",
      children: []
    });
    const refinedTree = this.refineTree(unrefinedTree);
    this.setState({
      treeState: unrefinedTree
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
    const features = this.props.featureClasses.keySeq().toArray();
    const featureClasses = this.props.featureClasses;
    const continousClasses = this.props.continousClasses;
    const labelClasses = this.props.labelClasses;

    for (let count = 0; count < 10; count++) {
      let entry = {};
      for (let i = 0; i < features.length; i++) {
        if (features[i] !== "label") {
          const currentClassLabels = featureClasses.get(features[i]);
          const isCategorical = !continousClasses.get(features[i]).get(0);
          const bottomRange = continousClasses.get(features[i]).get(1);
          const topRange = continousClasses.get(features[i]).get(2);
          const randomEntry = isCategorical
            ? currentClassLabels.get(
                Math.floor(Math.random() * currentClassLabels.size)
              )
            : Math.floor(
                Math.random() * (topRange - bottomRange) + bottomRange
              );
          entry[features[i]] = randomEntry;
        }
      }
      const randomLabel = labelClasses.get(
        Math.floor(Math.random() * labelClasses.size)
      );
      entry[this.props.label] = randomLabel;
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
    const valueClasses =
      this.props.featureClasses.get(key) != undefined
        ? this.props.featureClasses.get(key)
        : this.props.labelClasses;

    const isContinous =
      this.props.continousClasses.get(key) != undefined
        ? this.props.continousClasses.get(key).get(0)
        : false;

    return isContinous ? (
      <input
        value={value}
        onChange={e => this.changeDataRow(e, key, dataIndex)}
      />
    ) : (
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
    const features = this.props.featureClasses.keySeq().toArray();

    return (
      <Table size="sm">
        <thead>
          <tr>
            {features.map(feature => {
              return <th>{feature}</th>;
            })}
            <th>{this.props.label}</th>
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
                        !showNormalMode && features[index] === shownHighlights
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
      showFirstPage: true,
      renderTree: false
    });
  }

  showEntropyAndGain() {
    return (
      <div>
        <h3 as="h3">At level {this.state.displayedDepth}</h3>
        <h3 as="h3">
          Entropy of parent: {roundToTwoDecimalPlaces(this.state.shownEntropy)}
        </h3>
        <h3 as="h3">
          Gain of parent: {roundToTwoDecimalPlaces(this.state.shownGain)}
        </h3>
      </div>
    );
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
        <Col>
          <Row>{this.showCustomDataTable(false)}</Row>
          <Row>{this.showEntropyAndGain()}</Row>
        </Col>
      </Row>
    ) : null;
  }

  showDisplayButton() {
    return this.state.showFirstPage ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate Tree</Tooltip>}
      >
        <Nav.Link
          onClick={() => {
            this.setState({
              renderTree: true,
              showFirstPage: false
            });
            this.showTree();
          }}
        >
          <Image src={SomeTree} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showAddRowButton() {
    return this.state.showFirstPage && !this.state.showLearnMode ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Add a data row</Tooltip>}
      >
        <Nav.Link onClick={() => this.addRow()}>
          <Image src={Add} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRandomizeDataButton() {
    return this.state.showFirstPage && !this.state.showLearnMode ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate Random Data</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({ data: this.generateRandomDataState() })
          }
        >
          <Image src={Shuffle} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showBackToDataButton() {
    return this.state.renderTree ? (
      <Nav.Link
        onClick={() =>
          this.setState({
            renderTree: false,
            showFirstPage: true
          })
        }
      >
        <Image src={Back} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showBackToAlgorithimPageCustom() {
    return this.state.showFirstPage ? showBackToAlgorithimPage() : null;
  }

  showEntropyOrGiniSelection() {
    return !this.state.renderTree ? (
      <div>
        <select
          value={this.state.isGini ? "gini" : "entropy"}
          onChange={e => this.setState({ isGini: e.target.value === "gini" })}
        >
          <option value="gini">Gini</option>
          <option value="entropy">Entropy</option>
        </select>
      </div>
    ) : null;
  }

  showDecisionTreeNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {this.showBackToAlgorithimPageCustom()}
        {this.showBackToDataButton()}
        {this.showDisplayButton()}
        {this.showAddRowButton()}
        {this.showRandomizeDataButton()}
        {this.showEntropyOrGiniSelection()}
      </Navbar>
    );
  }

  showInformationBar() {
    return this.state.showFirstPage ? (
      <Col>
        {displayInfoButton(
          "Data Info Table",
          "This data is the data we use to generate our decision tree. You can change the values on each column on each row, delete rows with the trashcan, randomize data with the shuffle button.",
          "left"
        )}
        {this.showCustomDataTable()}
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
            <Col>{this.displayTreeInformation()}</Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  continousClasses: state.DTree.continousClasses,
  featureClasses: state.DTree.featureClasses,
  label: state.DTree.label,
  labelClasses: state.DTree.labelClasses
});

export default connect(mapStateToProps)(DTree);
