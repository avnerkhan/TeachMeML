/* eslint-disable */
import React from "react";
import Tree from "react-tree-graph";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import {
  determineBestSplit,
  determineMostLikelyLabel,
  getGiniMap,
  filteredData,
  calculateGiniValue
} from "./algorithims/DTreeAlgo";
import "../css_files/App.css";
import "react-table/react-table.css";

class DTree extends React.Component {
  constructor(props) {
    super(props);

    this.defaultLabels = ["Passed", "GPA", "Language"];
    this.defaultLabelClasses = {
      passed: ["Yes", "No"],
      gpa: ["4.0", "2.0"],
      language: ["Python", "Java", "C++"],
      label: [0, 1]
    };

    // State contains data. features are categorical, and label is last
    // Feature keys are ints so they are easily indexable
    this.state = {
      showMode: false,
      renderTree: false,
      renderTable: true,
      treeState: {},
      dataLabels: this.defaultLabels,
      shownData: [],
      data: this.generateRandomDataState(),
      labelClasses: this.defaultLabelClasses
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
  buildTree(dataLabels, data, currTree, maxDepth = null, currDepth = 0) {
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
    const bestSplit = determineBestSplit(dataLabels, data);
    const splitIndex = dataLabels.indexOf(bestSplit);
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
      this.buildTree(
        dataLabels,
        splitDict[classVal],
        newNode,
        maxDepth,
        currDepth + 1
      );
      currTree.children.push(newNode);
    }

    return currTree;
  }

  // Method that allows the tree to be show and initializes/resets its state
  showTree() {
    this.setState({
      renderTree: true,
      treeState: this.buildTree(this.state.dataLabels, this.state.data, {
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

  // Either deletes a class from feature or adds one
  changeClassFeatureState(modify, feature, isAdd) {
    if (modify !== "") {
      const featureLowerCase = feature.toLowerCase();
      let copyArr = this.state.labelClasses[featureLowerCase];

      if (isAdd) {
        copyArr.push(modify);
      } else {
        copyArr.splice(copyArr.indexOf(modify), 1);
      }
      let copyDict = this.state.labelClasses;
      copyDict[featureLowerCase] = copyArr;
      this.setState({
        labelClasses: copyDict
      });
    } else {
      alert("Please enter valid class name");
    }

    this.refs[feature].value = "";
  }

  // Either adds a new feature or deletes a current one
  changeFeatureState(feature, isAdd) {
    if (feature !== "") {
      let copyArr = this.state.dataLabels;
      let copyClasses = this.state.labelClasses;
      if (isAdd) {
        copyArr.push(feature);
        copyClasses[feature.toLowerCase()] = ["Sample"];
      } else {
        delete copyClasses[feature.toLowerCase()];
        copyArr.splice(copyArr.indexOf(feature), 1);
      }

      this.setState({
        dataLabels: copyArr,
        labelClasses: copyClasses
      });
    } else {
      alert("Please enter a valid feature name");
    }

    this.refs["newFeature"].value = "";
  }

  // Demonstrates current layout of table by dynamically generating JSX for state
  showCurrentLayout() {
    return (
      <Container>
        <Row>
          {this.state.dataLabels.map(feature => {
            return (
              <Col>
                <Card className="black-text" style={{ width: "32rem" }}>
                  <Card.Header
                    onClick={() => this.changeFeatureState(feature, false)}
                  >
                    {feature}
                  </Card.Header>
                  <ListGroup>
                    {this.state.labelClasses[feature.toLowerCase()].map(
                      className => {
                        return (
                          <ListGroup.Item
                            onClick={() =>
                              this.changeClassFeatureState(
                                className,
                                feature,
                                false
                              )
                            }
                          >
                            {className}
                          </ListGroup.Item>
                        );
                      }
                    )}
                    <InputGroup>
                      <FormControl
                        ref={feature}
                        placeholder="Enter new class name"
                      />
                      <InputGroup.Append>
                        <Button
                          onClick={() =>
                            this.changeClassFeatureState(
                              this.refs[feature].value,
                              feature,
                              true
                            )
                          }
                        >
                          Add New Class
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </ListGroup>
                </Card>
              </Col>
            );
          })}
          <Col>
            <InputGroup>
              <FormControl
                ref="newFeature"
                placeholder="Enter new feature name"
              />
              <InputGroup.Append>
                <Button
                  onClick={() =>
                    this.changeFeatureState(this.refs["newFeature"].value, true)
                  }
                >
                  Add New Feature
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }

  generateRandomDataState() {
    let dataState = [];
    let dataLabels =
      this.state == undefined ? this.defaultLabels : this.state.dataLabels;
    let labelClasses =
      this.state == undefined
        ? this.defaultLabelClasses
        : this.state.labelClasses;

    for (let count = 0; count < 10; count++) {
      let entry = {};
      for (let i = 0; i < dataLabels.length; i++) {
        let currentClassLabels = labelClasses[dataLabels[i].toLowerCase()];
        let randomEntry =
          currentClassLabels[
            Math.floor(Math.random() * currentClassLabels.length)
          ];
        entry[i] = randomEntry;
      }
      entry["label"] = count % 2;
      dataState.push(entry);
    }

    return dataState;
  }

  changeDataRow(e, index, dataIndex) {
    const data = this.state.data;
    data[dataIndex][index] = e.target.value;
    this.setState({
      data: data
    });
  }

  showSelectionForRow(value, index, dataIndex) {
    const valueClasses = Object.values(this.state.labelClasses);
    return (
      <select
        value={value}
        onChange={e => this.changeDataRow(e, index, dataIndex)}
      >
        {valueClasses[index].map(entry => {
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
    return (
      <Table size="sm">
        <thead>
          <tr>
            {this.state.dataLabels.map(feature => {
              return <th>{feature}</th>;
            })}
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((dataRow, dataIndex) => {
            return (
              <tr>
                {Object.values(dataRow).map((value, index) => {
                  return (
                    <td>{this.showSelectionForRow(value, index, dataIndex)}</td>
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
            {this.state.renderTable
              ? this.showCustomDataTable()
              : this.showCurrentLayout()}
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

export default DTree;
