/* eslint-disable */

import React from "react";
import ReactDOM from "react-dom";
import {
  showBackToAlgorithimPage,
  generateRandomUndetermined,
  calculateScale
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
      lines: [
        { x: 10, y: 30 },
        { x: 20, y: 50 },
        { x: 30, y: 75 },
        { x: 42, y: 82 }
      ],
      // Isolation or proximity based approach
      isIso: true
    };
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
        <LineSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          color="#FFFFFF"
          sizeRange={[0, 100]}
          data={[
            { x: 0, y: 50 },
            { x: 100, y: 50 }
          ]}
        />
        <LineSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          color="#FFFFFF"
          sizeRange={[0, 100]}
          data={[
            { x: 0, y: 70 },
            { x: 100, y: 70 }
          ]}
        />
        <LineSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          color="#FFFFFF"
          sizeRange={[0, 100]}
          data={[
            { x: 50, y: 0 },
            { x: 50, y: 100 }
          ]}
        />
        <LineSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          color="#FFFFFF"
          sizeRange={[0, 100]}
          data={[
            { x: 60, y: 0 },
            { x: 60, y: 100 }
          ]}
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
        <Nav.Link
          onClick={() => {
            this.setState({
              data: generateRandomUndetermined()
            });
          }}
        >
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
        x
        <div className="App-header">
          {this.showAnomalyNavBar()}
          {this.displayGraph()}
        </div>
      </div>
    );
  }
}

export default Anomaly;
