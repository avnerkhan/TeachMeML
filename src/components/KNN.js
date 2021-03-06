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
  HorizontalGridLines
} from "react-vis";
import Shuffle from "../Images/shuffle.png";
import { Nav, Form } from "react-bootstrap";
import {
  generateRandomData,
  getAllData,
  relabelData
} from "../algorithims/KNNAlgo";
import {
  euclidFunction,
  comparator,
  arrayRange,
  generateRandomUndetermined
} from "../Utility";
import "../css_files/App.css";
import {
  showBackToAlgorithimPage,
  displayInfoButton,
  calculateScale,
  showPictureWithOverlay,
  showNavBar,
  showMarkSeries
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

  // Shows the randomize undeterimened data button
  showRandomizeUndeterminedDataButton() {
    return showPictureWithOverlay(
      Object.keys(this.state.labeledData).length > 0,
      "Generate random undetermined points",
      () => {
        this.setState({
          undeterminedData: generateRandomUndetermined()
        });
      },
      Shuffle
    );
  }

  // Shows the randomize data button (labeled data)
  showRandomizeDataButton() {
    return showPictureWithOverlay(
      true,
      "Generate random labeled data",
      () =>
        this.setState({
          labeledData: generateRandomData(30, 100, this.props.labels)
        }),
      Shuffle
    );
  }

  // Shows dropdown selection for K
  showKSelection() {
    return this.state.undeterminedData.length > 0 ? this.showKSelect() : null;
  }

  // Shows the points on the plot that are labeled
  showLabeledMarkSeries() {
    return Object.keys(this.state.labeledData).map(color =>
      showMarkSeries(color, this.state.labeledData[color])
    );
  }

  showUnlabeledMarkSeries() {
    return showMarkSeries(
      this.stateEnum.UNLABELED,
      this.state.undeterminedData,
      datapoint => this.highlightK(datapoint, true),
      () => this.setState({ currentHighlightData: [] }),
      datapoint => this.highlightK(datapoint, false)
    );
  }

  showHighlightedMarkSeries() {
    return showMarkSeries(
      this.stateEnum.HIGHLIGHT,
      this.state.currentHighlightData
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
            let updatedDataUndetermined = this.state.undeterminedData;
            if (isNotOnHighlight) {
              const boundRect = ReactDOM.findDOMNode(
                this.refs.plotGraph
              ).getBoundingClientRect();
              const xCoord = calculateScale(
                e.screenX,
                boundRect.x,
                boundRect.width
              );
              const yCoord =
                120 - calculateScale(e.screenY, boundRect.y, boundRect.height);
              updatedDataUndetermined.push({ x: xCoord, y: yCoord });
              this.setState({
                undeterminedData: updatedDataUndetermined
              });
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
          {showNavBar([
            showBackToAlgorithimPage(),
            this.showRandomizeUndeterminedDataButton(),
            this.showRandomizeDataButton(),
            this.showKSelection()
          ])}
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
