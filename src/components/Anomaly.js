/* eslint-disable */

import React from "react";
import {
  showBackToAlgorithimPage,
  generateRandomUndetermined,
  showNavBar,
  showPictureWithOverlay,
  showMarkSeries
} from "../Utility";
import Check from "../Images/check.png";
import Shuffle from "../Images/shuffle.png";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries
} from "react-vis";
import { getPartitions, getOutliers } from "../algorithims/AnomalyAlgo";
import "../css_files/App.css";

class Anomaly extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      xDisplay: 0,
      yDisplay: 0,
      isoCount: 0,
      //Partitions of data made by our lines. List of Partition objects
      partitions: [],
      //List of outlier points
      outlierData: [],
      // List of Data Points
      data: [{ x: 0, y: 0 }],
      // Outlier lines
      lines: []
    };
  }

  displayLines() {
    return this.state.lines.map(coord => {
      return this.giveLine(coord);
    });
  }

  giveLine(coords) {
    const isVertical = coords.y === undefined;
    return (
      <LineSeries
        className="mark-series-example"
        strokeWidth={2}
        opacity="0.8"
        color="#FFFFFF"
        sizeRange={[0, 100]}
        data={
          isVertical
            ? this.giveVerticalLine(coords.x)
            : this.giveHorizontalLine(coords.y)
        }
      />
    );
  }

  giveVerticalLine(x) {
    return [
      { x, y: 0 },
      { x, y: 100 }
    ];
  }

  giveHorizontalLine(y) {
    return [
      { x: 0, y },
      { x: 100, y }
    ];
  }

  displayGraph() {
    return (
      <XYPlot
        width={550}
        height={550}
        xDomain={[0, 100]}
        yDomain={[0, 100]}
        style={{ zIndex: 0 }}
        ref="plotGraph"
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        {showMarkSeries("#FFFFFF", this.state.data)}
        {showMarkSeries("#000000", this.state.outlierData, point => {
          this.setState({
            xDisplay: point.x,
            yDisplay: point.y,
            isoCount: point.iterCount
          });
        })}
        {this.displayLines()}
      </XYPlot>
    );
  }

  showRunAlgorithimButton() {
    return showPictureWithOverlay(
      this.state.data.length > 1,
      "Run Anomaly Algorithim",
      () => {
        let currentLines = this.state.lines;
        const randomVal = Math.floor(Math.random() * 100);
        const randomDir = Math.floor(Math.random() * 2);
        const newVal = randomDir === 0 ? { x: randomVal } : { y: randomVal };
        currentLines.push(newVal);
        const partitionData = getPartitions(
          this.state.partitions,
          newVal,
          this.state.data
        );
        const newOutliers = getOutliers(
          partitionData,
          currentLines.length,
          this.state.outlierData
        );
        this.setState({
          lines: currentLines,
          partitions: partitionData,
          outlierData: newOutliers
        });
      },
      Check
    );
  }

  showShuffleButton() {
    return showPictureWithOverlay(
      true,
      "Generate Random Datapoints",
      () => {
        const randomData = generateRandomUndetermined();
        this.setState({
          data: randomData,
          partitions: getPartitions(this.state.partitions, {}, randomData)
        });
      },
      Shuffle
    );
  }

  displayIsolationInfo() {
    return (
      <div>
        <h1>X: {this.state.xDisplay}</h1>
        <h1>Y: {this.state.yDisplay}</h1>
        <h1>Iso Count: {this.state.isoCount}</h1>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {showNavBar([
            showBackToAlgorithimPage(),
            this.showShuffleButton(),
            this.showRunAlgorithimButton()
          ])}
          {this.displayGraph()}
          {this.displayIsolationInfo()}
        </div>
      </div>
    );
  }
}

export default Anomaly;
