/* eslint-disable */

import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from "react-vis";
import { showBackToAlgorithimPage } from "../Utility";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Reset from "../Images/reset.png";
import Check from "../Images/check.png";
import Eraser from "../Images/eraser.png";
import Forward from "../Images/forward.png";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {
  generateEmptyCluster,
  generateRandomColors,
  runDBScan,
  unclusterData,
  pushIntoCentroid,
  smallClusterDrop,
  runIteration
} from "../algorithims/ClusteringAlgo";
import { arrayRange, displayInfoButton } from "../Utility";
import "../css_files/App.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class Clustering extends React.Component {
  constructor(props) {
    super(props);

    this.stateEnum = {
      UNLABELED: "#FFFFFF",
      CENTROID: "#000000",
      CLUSTER: generateRandomColors(),
      KMEANS: 0,
      DBSCAN: 1,
      OUTLIER: 0
    };

    this.state = {
      algorithim: this.stateEnum.KMEANS,
      spacing: 1,
      pointNum: 1,
      minEps: 3,
      minPts: 3,
      runningDBScan: false,
      readyToStartState: false,
      choosingCentroidState: false,
      runningKMeans: false,
      unlabeledData: [{ x: 0, y: 0 }],
      clusteredData: generateEmptyCluster(),
      centroidData: []
    };
  }

  // Allows a user click on a point to become a centroid
  makeCentroid(datapoint) {
    if (
      this.state.centroidData.length < 5 &&
      this.state.choosingCentroidState
    ) {
      this.setState({
        centroidData: pushIntoCentroid(this.state.centroidData, datapoint)
      });
    } else if (!this.state.choosingCentroidState) {
      alert("K Means not running, do not choose centroid");
    } else {
      alert("Cannot have more than 5 clusters.");
    }
  }

  // Clears data and state
  clearSlate() {
    this.setState({
      runningDBScan: false,
      readyToStartState: false,
      choosingCentroidState: false,
      runningKMeans: false,
      unlabeledData: [{ x: 0, y: 0 }],
      clusteredData: [],
      centroidData: []
    });
  }

  // Shows selection for MinEps and MinPts
  showDBScanSelection() {
    return (
      <Form.Group>
        <Form.Label>Select MinEps (for DBSCAN)</Form.Label>

        <Form.Control
          as="select"
          onChange={e => this.setState({ minEps: e.target.value })}
        >
          {arrayRange(3, 30).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
        <Form.Label>Select MinPts (for DBSCAN</Form.Label>
        <Form.Control
          as="select"
          onChange={e => this.setState({ minPts: e.target.value })}
        >
          {arrayRange(3, 20).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
      </Form.Group>
    );
  }

  // Shows options for cluster deployment, as well as algorithim selection
  showClusterDeploymentSelection() {
    return (
      <Form>
        {displayInfoButton(
          "Cluster Spacing",
          "Determine how much each point will be spaced out when placing on grid",
          "right"
        )}
        <Form.Label>Select Cluster Spacing</Form.Label>
        <Form.Control
          as="select"
          onChange={e => this.setState({ spacing: e.target.value })}
        >
          {arrayRange(1, 10).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
        {displayInfoButton(
          "Cluster Point Number",
          "Determine how points will be placed on each mouse click",
          "right"
        )}
        <Form.Label>Select Cluster Points</Form.Label>
        <Form.Control
          as="select"
          onChange={e => this.setState({ pointNum: e.target.value })}
        >
          {arrayRange(1, 9).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
        {this.state.algorithim == this.stateEnum.DBSCAN
          ? this.showDBScanSelection()
          : null}
        <Form.Label>Select Algorithim</Form.Label>
        <Form.Control
          as="select"
          onChange={e => this.setState({ algorithim: e.target.value })}
        >
          <option value={this.stateEnum.KMEANS}>K Means</option>
          <option value={this.stateEnum.DBSCAN}>DBScan</option>
        </Form.Control>
      </Form>
    );
  }

  // Checks which algorithim to start, based on selection
  startRespectiveAlgorithim() {
    if (this.state.algorithim == this.stateEnum.KMEANS)
      this.setState({ choosingCentroidState: true, readyToStartState: false });
    if (this.state.algorithim == this.stateEnum.DBSCAN) {
      const [clusterData, centroidData] = runDBScan(
        this.state.unlabeledData,
        this.state.minEps,
        this.state.minPts,
        this.stateEnum,
        this.state.centroidData,
        this.state.clusteredData
      );
      this.setState({
        runningDBScan: true,
        readyToStartState: false,
        centroidData: centroidData,
        clusteredData: clusterData
      });
    }
  }

  // Checks if user has picked at least two centroids
  checkCentroidPick() {
    if (this.state.centroidData.length > 1) {
      this.setState({ choosingCentroidState: false, runningKMeans: true });
    } else {
      alert("Please pick a valid number of centroids");
    }
  }

  showClusterDeploymentSelectionBar() {
    return !this.state.choosingCentroidState &&
      !this.state.runningKMeans &&
      !this.state.runningDBScan
      ? this.showClusterDeploymentSelection()
      : null;
  }

  showDBScanSelectionBar() {
    return this.state.runningDBScan ? this.showDBScanSelection() : null;
  }

  showStartAlgorithimBar() {
    return this.state.readyToStartState ? (
      <Nav.Link onClick={() => this.startRespectiveAlgorithim()}>
        Start Algorithim
      </Nav.Link>
    ) : null;
  }

  showStartChoosingCentroidBar() {
    return this.state.choosingCentroidState ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Finished choosing centroids</Tooltip>}
      >
        <Nav.Link onClick={() => this.checkCentroidPick()}>
          <Image src={Check} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRunNextIterationBar() {
    return this.state.runningKMeans ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Run next iteration</Tooltip>}
      >
        <Nav.Link
          onClick={() => {
            const [unlabeledData, clusteredData, centroidData] = runIteration(
              this.state.centroidData,
              this.state.clusteredData,
              this.state.unlabeledData
            );
            this.setState({
              centroidData: centroidData,
              unlabeledData: unlabeledData,
              clusteredData: clusteredData
            });
          }}
        >
          <Image src={Forward} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showClearSlateBar() {
    return this.state.runningKMeans || this.state.runningDBScan ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Start from beginning</Tooltip>}
      >
        <Nav.Link onClick={() => this.clearSlate()}>
          <Image src={Eraser} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showResetClusterBar() {
    return this.state.runningDBScan ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Reset this DBSCAN</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.setState({
              centroidData: [],
              clusteredData: generateEmptyCluster(),
              unlabeledData: unclusterData(
                this.state.unlabeledData,
                this.state.centroidData,
                this.state.clusteredData
              )
            })
          }
        >
          <Image src={Reset} className="small-photo" />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRunDBScanAgainBar() {
    return this.state.runningDBScan ? (
      <Nav.Link onClick={() => this.startRespectiveAlgorithim()}>
        <Image src={Check} className="small-photo" />
      </Nav.Link>
    ) : null;
  }

  showClusteringNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showStartAlgorithimBar()}
        {this.showStartChoosingCentroidBar()}
        {this.showRunNextIterationBar()}
        {this.showClearSlateBar()}
        {this.showRunDBScanAgainBar()}
        {this.showResetClusterBar()}
      </Navbar>
    );
  }

  displayClusterDeploymentArea() {
    return (
      <XYPlot
        width={600}
        height={600}
        onClick={e => {
          const newData = smallClusterDrop(
            e,
            this.state.choosingCentroidState,
            this.state.runningKMeans,
            this.state.spacing,
            this.state.pointNum,
            this.state.unlabeledData
          );
          if (newData != undefined) {
            this.setState({
              unlabeledData: newData,
              readyToStartState: true
            });
          }
        }}
        xDomain={[0, 100]}
        yDomain={[0, 100]}
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
          color={this.stateEnum.UNLABELED}
          data={this.state.unlabeledData}
          onValueClick={datapoint => this.makeCentroid(datapoint)}
        />
        <MarkSeries
          className="mark-series-example"
          strokeWidth={2}
          opacity="0.8"
          sizeRange={[0, 100]}
          color={this.stateEnum.CENTROID}
          data={this.state.centroidData}
        />
        {this.state.clusteredData.map(cluster => {
          return (
            <MarkSeries
              className="mark-series-example"
              strokeWidth={2}
              opacity="0.8"
              sizeRange={[0, 100]}
              color={
                this.stateEnum.CLUSTER[
                  this.state.clusteredData.indexOf(cluster)
                ]
              }
              data={cluster}
            />
          );
        })}
      </XYPlot>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showClusteringNavBar()}
          {displayInfoButton(
            "Clustering Algorithims",
            "Start pressing on the grid anywhere to start adding points to the grid. Once the algorithim starts running, press the check mark to finish choosing centroids (If KMeans). The right arrow runs an iteration of Kmeans, and the eraser resets the board. If you choose DBScan, simply run the algorithim and watch the board populate with the coloring based on the configurations you chose.",
            "right"
          )}
          <Row>
            {this.state.choosingCentroidState ? (
              <h1>Please Select Clusters</h1>
            ) : null}
            {this.displayClusterDeploymentArea()}
            {this.showClusterDeploymentSelectionBar()}
            {this.showDBScanSelectionBar()}
          </Row>
        </div>
      </div>
    );
  }
}

export default Clustering;
