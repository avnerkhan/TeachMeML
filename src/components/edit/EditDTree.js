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

class EditDTree extends React.Component {
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
      dataLabels: this.defaultLabels,
      labelClasses: this.defaultLabelClasses
    };
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

  render() {
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
}

export default EditDTree;
