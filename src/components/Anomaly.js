/* eslint-disable */

import React from "react";
import { showBackToAlgorithimPage } from "../Utility";
import { Navbar, OverlayTrigger, Tooltip, Nav, Image } from "react-bootstrap";
import Check from "../Images/check.png";
import Shuffle from "../Images/shuffle.png";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
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

  displayGraph() {
    return (
      <XYPlot
        width={550}
        height={550}
        xDomain={[0, 100]}
        yDomain={[0, 100]}
        ref="plotGraph"
        onClick={e => {}}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <MarkSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          sizeRange={[0, 100]}
          data={this.state.data}
        />
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
    return (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run Anomaly Algorithim</Tooltip>}
      >
        <Nav.Link onClick={() => {}}>
          <Image src={Check} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    );
  }

  showShuffleButton() {
    return (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate Random Datapoints</Tooltip>}
      >
        <Nav.Link onClick={() => {}}>
          <Image src={Shuffle} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    );
  }

  showAnomalyNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showAnomalyAlgorithimSelection()}
        {this.showShuffleButton()}
        {this.showRunAlgorithimButton()}
      </Navbar>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showAnomalyNavBar()}
          {this.displayGraph()}
        </div>
      </div>
    );
  }
}

export default Anomaly;
