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
  determineClassLabel,
  buildTree,
  generateRandomDataState,
  addRow,
  refineTree,
  changeDataRow
} from "../algorithims/DTreeAlgo";
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
      data: generateRandomDataState(
        this.props.featureClasses,
        this.props.continousClasses,
        this.props.labelClasses,
        this.props.label
      ),
      currentHighlight: null,
      shownData: [],
      shownEntropy: 0.0,
      shownGain: 0.0,
      showGainSplit: 0.0,
      shownSplitInfo: 0.0
    };
  }

  presentData(
    shownData,
    classVal,
    entropy,
    highestGainInfo,
    currDepth,
    splitInfo,
    gainSplit
  ) {
    this.setState({
      displayedDepth: currDepth,
      shownData: shownData,
      currentHighlight: determineClassLabel(
        classVal,
        this.props.featureClasses
      ),
      shownEntropy: entropy,
      shownGain: highestGainInfo,
      showGainSplit: gainSplit,
      shownSplitInfo: splitInfo
    });
  }

  // Method that allows the tree to be show and initializes/resets its state
  showTree() {
    const unrefinedTree = buildTree(
      this.state.data,
      {
        name: "Start",
        children: []
      },
      this.props.featureClasses.size + 1,
      0,
      this.props.featureClasses,
      this.state.isGini,
      this.props.label,
      this.props.continousClasses,
      this.props.labelClasses,
      this
    );
    const refinedTree = refineTree(unrefinedTree);

    this.setState({
      treeState: refinedTree
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
        onChange={e =>
          this.setState({
            data: changeDataRow(e, key, dataIndex, this.state.data)
          })
        }
      />
    ) : (
      <select
        value={value}
        onChange={e =>
          this.setState({
            data: changeDataRow(e, key, dataIndex, this.state.data)
          })
        }
      >
        {valueClasses.map(entry => {
          return <option value={entry}>{entry}</option>;
        })}
      </select>
    );
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
                  <td
                    onClick={() =>
                      this.setState({
                        data: this.state.data.filter((row, index) => {
                          return index !== dataIndex;
                        })
                      })
                    }
                  >
                    <Image src={Trash} className="small-photo" />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  showImpurityAndGain() {
    return (
      <div>
        <h3 as="h3">At level {this.state.displayedDepth}</h3>
        <h3 as="h3">
          Impurity of parent: {roundToTwoDecimalPlaces(this.state.shownEntropy)}
        </h3>
        <h3 as="h3">
          Gain of parent: {roundToTwoDecimalPlaces(this.state.shownGain)}
        </h3>
        <h3 as="h3">
          Split info of parent:{" "}
          {roundToTwoDecimalPlaces(this.state.shownSplitInfo)}
        </h3>
        <h3 as="h3">
          Gain Split of parent:{" "}
          {roundToTwoDecimalPlaces(this.state.showGainSplit)}
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
          <Row>{this.showImpurityAndGain()}</Row>
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
          <Image src={SomeTree} className="small-photo" />
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
        <Nav.Link
          onClick={() =>
            this.setState({
              data: addRow(this.state.data)
            })
          }
        >
          <Image src={Add} className="small-photo" />
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
            this.setState({
              data: generateRandomDataState(
                this.props.featureClasses,
                this.props.continousClasses,
                this.props.labelClasses,
                this.props.label
              )
            })
          }
        >
          <Image src={Shuffle} className="small-photo" />
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
        <Image src={Back} className="small-photo" />
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
