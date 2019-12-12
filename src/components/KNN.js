/* eslint-disable */

/*
  KNN play page
*/

import React from "react";
import ReactDOM from "react-dom";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from "react-vis";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import Shuffle from "../Images/shuffle.png";
import { Nav, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  generateRandomData,
  getAllData,
  relabelData
} from "../algorithims/KNNAlgo";
import { euclidFunction, comparator, arrayRange } from "../Utility";
import "../css_files/App.css";
import {
  showBackToAlgorithimPage,
  displayInfoButton,
  calculateScale
} from "../Utility";
import { connect } from "react-redux";

class KNN extends React.Component {
  constructor(props) {
    super(props);

    this.stateEnum = {
      UNLABELED: "#FFFFFF",
      HIGHLIGHT: "#FFFF00"
    };

    const randomData = generateRandomData(30, 100, this.props.labels);

    this.state = {
      // What our "K" in KNN is set to
      k: 1,
      // Data on the plot that is currently labeled
      labeledData: randomData,
      // Data on the plot that is undetermined
      undeterminedData: [],
      // Data on the plot that is highlighted (user is hovering over an undetermined, and highlights what our algorithim will pick)
      currentHighlightData: []
    };
  }

  // Adds an undetermined point to the grid
  addPoint(xCoord, yCoord) {
    let updatedDataUndetermined = this.state.undeterminedData;
    updatedDataUndetermined.push({ x: xCoord, y: yCoord });
    this.setState({
      undeterminedData: updatedDataUndetermined
    });
  }

  // Shows selectable values for K
  showKSelect() {
    return (
      <Nav.Link>
        <Form>
          <Form.Group>
            <Form.Label>Select K value</Form.Label>
            <Form.Control
              as="select"
              onChange={e => this.setState({ k: e.target.value })}
            >
              {arrayRange(1, 10).map(num => {
                return <option value={num}>{num}</option>;
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      </Nav.Link>
    );
  }

  // Highlights K on mouse over or determines point on click
  highlightK(datapoint, isChange) {
    let highlightPoints = [];
    let newData = this.state.labeledData;
    let newUnlabeled = this.state.undeterminedData;
    let allData = getAllData(this.state.labeledData);
    allData = allData.map(point => relabelData(point, this.state.labeledData));
    let euclidMap = allData.map(point => euclidFunction(point, datapoint));
    euclidMap.sort(comparator);
    let countMap = {};
    let highestCount = 0;

    for (let i = 0; i < this.state.k; i++) {
      highlightPoints.push(euclidMap[i].orginalPoint);
      const currentColor = euclidMap[i].orginalPoint.class;
      if (countMap[currentColor] == undefined) {
        countMap[currentColor] = 1;
      } else {
        countMap[currentColor] += 1;
      }
      highestCount = Math.max(highestCount, countMap[currentColor]);
    }

    if (isChange) {
      for (const color in countMap) {
        if (countMap[color] === highestCount) {
          newData[color].push(datapoint);
        }
      }
      newUnlabeled.splice(newUnlabeled.indexOf(datapoint), 1);
      highlightPoints = [];
    }

    this.setState({
      labeledData: newData,
      undeterminedData: newUnlabeled,
      currentHighlightData: highlightPoints
    });
  }

  // Generates random underterimend data and adds them to the plot
  generateRandomUndetermined(length = 20, max = 100) {
    for (let i = 0; i < length; i++) {
      const randomX = Math.floor(Math.random() * max);
      const randomY = Math.floor(Math.random() * max);
      this.addPoint(randomX, randomY);
    }
  }

  // Shows the randomize undeterimened data button
  showRandomizeUndeterminedDataButton() {
    return Object.keys(this.state.labeledData).length > 0 ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate random undetermined points</Tooltip>}
      >
        <Nav.Link onClick={() => this.generateRandomUndetermined()}>
          <Image src={Shuffle} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  // Shows the randomize data button (labeled data)
  showRandomizeDataButton() {
    return (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate random labeled data</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({
              labeledData: generateRandomData(30, 100, this.props.labels)
            })
          }
        >
          <Image src={Shuffle} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    );
  }

  // Shows dropdown selection for K
  showKSelection() {
    return this.state.undeterminedData.length > 0 ? this.showKSelect() : null;
  }

  // Shows nav bar for this component
  showKNNNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showRandomizeUndeterminedDataButton()}
        {this.showRandomizeDataButton()}
        {this.showKSelection()}
      </Navbar>
    );
  }

  // Shows the points on the plot that are labeled
  showLabeledMarkSeries() {
    return Object.keys(this.state.labeledData).map(color => {
      return (
        <MarkSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          sizeRange={[0, 100]}
          color={color}
          data={this.state.labeledData[color]}
        />
      );
    });
  }

  showUnlabeledMarkSeries() {
    return (
      <MarkSeries
        className="mark-series-example"
        strokeWidth={2}
        opacity="0.8"
        sizeRange={[0, 100]}
        onValueMouseOut={() => this.setState({ currentHighlightData: [] })}
        onValueMouseOver={datapoint => this.highlightK(datapoint, false)}
        onValueClick={datapoint => this.highlightK(datapoint, true)}
        color={this.stateEnum.UNLABELED}
        data={this.state.undeterminedData}
      />
    );
  }

  showHighlightedMarkSeries() {
    return (
      <MarkSeries
        className="mark-series-example"
        strokeWidth={2}
        opacity="0.8"
        sizeRange={[0, 100]}
        color={this.stateEnum.HIGHLIGHT}
        data={this.state.currentHighlightData}
      />
    );
  }

  // Shows all mark series together, as one plot
  displayKNNExperiement() {
    return (
      <div>
        {displayInfoButton(
          "KNN Plot",
          "Use the bar above to add your own coordinates to the grid. All undetermined datapoints are black, and there are only two classes. The first shuffle button randomizes determined data, while the second shuffle button places random undetermined points. Hover your mouse over an undetermined point to see which points that it will use nearby to determine, and press on the point to determine.",
          "left"
        )}
        <XYPlot
          width={600}
          height={600}
          ref="plotGraph"
          onClick={e => {
            const isNotOnHighlight =
              this.state.currentHighlightData.length === 0;
            if (isNotOnHighlight) {
              const boundRect = ReactDOM.findDOMNode(
                this.refs.plotGraph
              ).getBoundingClientRect();
              const xCoord = calculateScale(e.screenX, boundRect.x, 600);
              const yCoord = 120 - calculateScale(e.screenY, boundRect.y, 600);
              this.addPoint(xCoord, yCoord);
            }
          }}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          {this.showLabeledMarkSeries()}
          {this.showUnlabeledMarkSeries()}
          {this.showHighlightedMarkSeries()}
        </XYPlot>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showKNNNavBar()}
          {this.displayKNNExperiement()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.KNN.labels
});

export default connect(mapStateToProps)(KNN);
