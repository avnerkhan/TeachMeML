/* eslint-disable */
import React from "react";
import Tree from "react-tree-graph";
import Shuffle from "../Images/shuffle.png";
import Edit from "../Images/edit.png";
import Save from "../Images/save.png";
import Back from "../Images/back.png";
import Add from "../Images/add.png";
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
import DTreeLearn from "./learn/DTreeLearn";
import EditDTree from "./edit/EditDTree";
import {
  determineBestSplit,
  determineMostLikelyLabel,
  getMap,
  filteredData,
  calculateImpurityValue
} from "./algorithims/DTreeAlgo";
import "../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";
import {
  displayInfoButton,
  showBackToAlgorithimPage,
  roundToTwoDecimalPlaces,
  showLearnModeIcon
} from "../Utility";

class DTree extends React.Component {
  constructor(props) {
    super(props);

    // State contains data. features are categorical, and label is last
    // Feature keys are ints so they are easily indexable
    this.state = {
      isGini: true,
      renderTree: false,
      showEditPanel: false,
      showLearnMode: false,
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
    for (const key of this.props.featureClasses.keySeq()) {
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

  // Builds decision tree, with entropy as 0 as base case.
  buildTree(data, currTree, maxDepth = null, currDepth = 0) {
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
      this.props.features,
      data,
      this.state.isGini,
      this.props.label
    );
    const bestSplit = information.currentHighestGainLabel;
    const gainAmount = information.currentHighestGain;
    const classArr = getMap(
      bestSplit,
      data,
      true,
      this.state.isGini,
      this.props.label
    );

    for (const classVal in classArr) {
      splitDict[classVal] = filteredData(classVal, bestSplit, data);
    }

    for (const classVal in splitDict) {
      let name =
        classVal === "undefined"
          ? determineMostLikelyLabel(data, this.props.label)
          : classVal;

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
      treeState: this.buildTree(this.state.data, {
        name: "Start",
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
    const features = this.props.features;
    const featureClasses = this.props.featureClasses;
    const labelClasses = this.props.labelClasses;

    for (let count = 0; count < 10; count++) {
      let entry = {};
      for (let i = 0; i < features.size; i++) {
        if (features.get(i) !== "label") {
          const currentClassLabels = featureClasses.get(features.get(i));
          const randomEntry = currentClassLabels.get(
            Math.floor(Math.random() * currentClassLabels.size)
          );
          entry[features.get(i)] = randomEntry;
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
            {this.props.features.map(feature => {
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
                        !showNormalMode &&
                        this.props.features.get(index) === shownHighlights
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
      renderTree: false,
      showEditPanel: false,
      showLearnMode: false
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

  displayEditTableInformation() {
    return this.state.showEditPanel ? <EditDTree /> : null;
  }

  showDisplayButton() {
    return this.state.showFirstPage && !this.state.showLearnMode ? (
      <Nav.Link
        onClick={() => {
          this.setState({
            renderTree: true,
            showFirstPage: false,
            showLearnMode: false,
            showEditPanel: false
          });
          this.showTree();
        }}
      >
        Generate Tree
      </Nav.Link>
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

  showRenderTableButton() {
    return this.state.showFirstPage && !this.state.showLearnMode ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Edit Features</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({
              renderTree: false,
              showFirstPage: false,
              showEditPanel: true,
              showLearnMode: false
            })
          }
        >
          <Image src={Edit} style={{ width: 40 }} />
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
            showFirstPage: true,
            showLearnMode: false
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

  showLearnModeIconCustom() {
    return this.state.showFirstPage ? showLearnModeIcon(this) : null;
  }

  showSaveIcon() {
    return this.state.showEditPanel ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Save configuration</Tooltip>}
      >
        <Nav.Link onClick={() => this.saveEditState({})}>
          <Image src={Save} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showEntropyOrGiniSelection() {
    return !this.state.showLearnMode &&
      !this.state.renderTree &&
      !this.state.showEditPanel ? (
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
    console.log(this.state);
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {this.showBackToAlgorithimPageCustom()}
        {this.showBackToDataButton()}
        {this.showDisplayButton()}
        {this.showAddRowButton()}
        {this.showSaveIcon()}
        {this.showRandomizeDataButton()}
        {this.showRenderTableButton()}
        {this.showEntropyOrGiniSelection()}
        {this.showLearnModeIconCustom()}
      </Navbar>
    );
  }

  showInformationBar() {
    return this.state.showFirstPage && !this.state.showLearnMode ? (
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

  displayLearnModeDTree() {
    return this.state.showLearnMode ? <DTreeLearn /> : null;
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
              {this.displayLearnModeDTree()}
              {this.displayEditTableInformation()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  features: state.DTree.features,
  featureClasses: state.DTree.featureClasses,
  label: state.DTree.label,
  labelClasses: state.DTree.labelClasses
});

export default connect(mapStateToProps)(DTree);
