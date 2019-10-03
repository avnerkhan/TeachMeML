/* eslint-disable */
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import "../../css_files/App.css";
import "react-table/react-table.css";
import { connect } from "react-redux";
import { displayInfoButton } from "../../Utility";
import {
  addDataClass,
  addDataLabel,
  deleteDataClass,
  deleteDataLabel
} from "../../actions/DTreeActions";

class EditDTree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        {displayInfoButton(
          "Table Editing Page",
          "This is the page where you can edit the configuration of your data. For example, you can add another feature, delete it, or add/delete another class label to an existing feature",
          "bottom"
        )}
        <Row>
          {this.props.dataLabels.map(feature => {
            return (
              <Col>
                <Card className="black-text" style={{ width: "32rem" }}>
                  <Card.Header
                    onClick={() => this.props.deleteDataLabel(feature)}
                  >
                    {feature}
                  </Card.Header>
                  <ListGroup>
                    {this.props.labelClasses.get(feature).map(className => {
                      return (
                        <ListGroup.Item
                          onClick={() =>
                            this.props.deleteDataClass(feature, className)
                          }
                        >
                          {className}
                        </ListGroup.Item>
                      );
                    })}
                    <InputGroup>
                      <FormControl
                        ref={feature}
                        placeholder="Enter new class name"
                      />
                      <InputGroup.Append>
                        <Button
                          onClick={() =>
                            this.props.addDataClass(
                              feature,
                              this.refs[feature].value
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
                    this.props.addDataLabel(this.refs["newFeature"].value)
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

const mapStateToProps = state => ({
  dataLabels: state.DTree.dataLabels,
  labelClasses: state.DTree.labelClasses
});

const mapDispatchToProps = {
  addDataLabel,
  addDataClass,
  deleteDataLabel,
  deleteDataClass
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDTree);
