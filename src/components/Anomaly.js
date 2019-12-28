/* eslint-disable */

import React from "react";
import ReactDOM from "react-dom";
import {
  showBackToAlgorithimPage,
  generateRandomUndetermined,
  calculateScale,
  showNavBar,
  showPictureWithOverlay
} from "../Utility";
import { Navbar, OverlayTrigger, Tooltip, Nav, Image } from "react-bootstrap";
import Check from "../Images/check.png";
import Shuffle from "../Images/shuffle.png";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  LineSeries
} from "react-vis";
import "../css_files/App.css";

class Anomaly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // List of Data Points
      data: [{ x: 0, y: 0 }],
      // Outlier lines
      lines: [],
      // Isolation or proximity based approach
      isIso: true
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
        id="plotGraphOne"
        width={550}
        height={550}
        xDomain={[0, 100]}
        yDomain={[0, 100]}
        style={{ zIndex: 0 }}
        ref="plotGraph"
        onClick={e => {
          let currentUpdatedData = this.state.data;
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

          currentUpdatedData.push({ x: xCoord, y: yCoord });
          this.setState({
            data: currentUpdatedData
          });
        }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <MarkSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          color="#FFFFFF"
          sizeRange={[0, 100]}
          data={this.state.data}
        />
        {this.displayLines()}
      </XYPlot>
    );
  }

  // Entropy or gini selection on nav bar
  showAnomalyAlgorithimSelection() {
    return (
      <div>
        <select
          value={this.state.isIso ? "iso" : "prox"}
          onChange={e => this.setState({ isIso: e.target.value === "iso" })}
        >
          <option value="iso">Isolation</option>
          <option value="prox">Proximity</option>
        </select>
      </div>
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
        this.setState({ lines: currentLines });
      },
      Check
    );
  }

  showShuffleButton() {
    return showPictureWithOverlay(
      true,
      "Generate Random Datapoints",
      () => {
        this.setState({
          data: generateRandomUndetermined()
        });
      },
      Shuffle
    );
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          {showNavBar([
            showBackToAlgorithimPage(),
            this.showAnomalyAlgorithimSelection(),
            this.showShuffleButton(),
            this.showRunAlgorithimButton()
          ])}
          {this.displayGraph()}
        </div>
      </div>
    );
  }
}

export default Anomaly;
