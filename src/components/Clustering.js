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
import { euclidFunction, comparator, arrayRange } from "../Utility";
import "../css_files/App.css";

class Clustering extends React.Component {
  constructor(props) {
    super(props);

    this.stateEnum = {
      UNLABELED: "#FFFFFF",
      CENTROID: "#000000",
      CLUSTER: this.generateRandomColors(),
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
      clusteredData: this.generateEmptyCluster(),
      centroidData: []
    };
  }

  generateEmptyCluster() {
    let emptyClusterHolder = [];

    for (let i = 0; i < 100; i++) emptyClusterHolder.push([]);

    return emptyClusterHolder;
  }
  // Allows user to add a small cluster unlabeled points for later labeling
  smallClusterDrop(e) {
    if (!this.state.choosingCentroidState && !this.state.runningKMeans) {
      let factor = this.state.spacing;
      let numberPoints = this.state.pointNum;
      let xCoord = Math.floor((e.screenX - 315) / 5.5);
      let yCoord = Math.floor(100 - (e.screenY - 170) / 5.5);
      let newData = this.state.unlabeledData;

      if (newData[0].x === 0 && newData[0].y === 0) newData.shift();

      let cardinal = [
        [0, 0],
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1]
      ];

      for (let i = 0; i < numberPoints; i++) {
        let direction = cardinal[i];
        newData.push({
          x: xCoord + direction[0] * factor,
          y: yCoord + direction[1] * factor
        });
      }

      this.setState({
        unlabeledData: newData,
        readyToStartState: true
      });
    }
  }

  // Runs an iteration of K means. Either determines centroid or labels data
  // based on current centroid
  runIteration() {
    let centroidData = this.state.centroidData;
    let clusterData = this.state.clusteredData;
    let unlabeledData = this.state.unlabeledData;

    if (unlabeledData.length > 0) {
      for (let point of this.state.unlabeledData) {
        if (point !== undefined && !isNaN(point.x)) {
          let nearestMap = centroidData.map(centroid =>
            euclidFunction(centroid, point)
          );
          nearestMap.sort(comparator);
          let nearestCentroid = nearestMap[0].orginalPoint;
          clusterData[centroidData.indexOf(nearestCentroid)].push(point);
        }
      }

      this.setState({
        unlabeledData: [],
        clusteredData: clusterData
      });
    } else {
      for (let count = 0; count < clusterData.length; count++) {
        let cluster = clusterData[count];
        let xAvg = 0.0;
        let yAvg = 0.0;

        for (let point of cluster) {
          xAvg += point.x;
          yAvg += point.y;
          unlabeledData.push(point);
        }

        xAvg = xAvg / cluster.length;
        yAvg = yAvg / cluster.length;

        let newCentroid = { x: xAvg, y: yAvg };
        centroidData[count] = newCentroid;
        clusterData[count] = [];
      }

      this.setState({
        centroidData: centroidData,
        clusterData: clusterData,
        unlabeledData: unlabeledData
      });
    }
  }

  // Allows a user click on a point to become a centroid
  makeCentroid(datapoint) {
    if (
      this.state.centroidData.length < 5 &&
      this.state.choosingCentroidState
    ) {
      let newCentroidState = this.state.centroidData;
      let newUnlabeledData = this.state.unlabeledData;

      if (this.state.choosingCentroidState) {
        newCentroidState.push(datapoint);
      }

      this.setState({
        centroidData: newCentroidState,
        unlabeledData: newUnlabeledData
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
        <Form.Label>Select Cluster Spacing value</Form.Label>

        <Form.Control
          as="select"
          onChange={e => this.setState({ spacing: e.target.value })}
        >
          {arrayRange(1, 10).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
        <Form.Label>Select Cluster Points</Form.Label>
        <Form.Control
          as="select"
          onChange={e => this.setState({ pointNum: e.target.value })}
        >
          {arrayRange(1, 9).map(num => {
            return <option value={num}>{num}</option>;
          })}
        </Form.Control>
        {this.showDBScanSelection()}
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

  // Runs db scan on unlabeled data
  runDBScan() {
    let unlabeled = this.state.unlabeledData;
    let clusters = 0;

    for (let point of unlabeled) {
      if (point.label == undefined) {
        let neighbhors = unlabeled.filter(
          comparePoint =>
            euclidFunction(point, comparePoint).distance <= this.state.minEps
        );

        if (neighbhors.length >= this.state.minPts) {
          clusters++;
          point.label = clusters;

          for (let newPoint of neighbhors) {
            if (newPoint.label === this.stateEnum.OUTLIER)
              newPoint.label = clusters;

            if (newPoint.label == undefined) {
              newPoint.label = clusters;
              let newNeighbhors = unlabeled.filter(
                comparePoint =>
                  euclidFunction(newPoint, comparePoint).distance <=
                  this.state.minEps
              );

              if (newNeighbhors.length >= this.state.minPts) {
                for (let nextDoor of newNeighbhors) neighbhors.push(nextDoor);
              }
            }
          }
        } else {
          point.label = this.stateEnum.OUTLIER;
        }
      }
    }

    this.relabelData(unlabeled);
  }

  // Takes data and places into clusters based on label
  relabelData(newData) {
    let clusterData = this.state.clusteredData;
    let outlierData = this.state.centroidData;

    for (let point of newData) {
      if (point.label === 0) {
        outlierData.push(point);
      } else {
        if (clusterData[point.label] != undefined)
          clusterData[point.label].push(point);
      }
    }

    this.setState({
      clusterData: clusterData,
      centroidData: outlierData
    });
  }

  // Generates Array of random colors
  generateRandomColors() {
    let colorArr = [];

    for (let i = 0; i < 100; i++) {
      colorArr.push(this.newRandomColor());
    }

    return colorArr;
  }

  // Generates a single random hex color
  newRandomColor() {
    let potential = "ABCDEF0123456789";
    let toReturn = "#";

    for (let i = 0; i < 6; i++) {
      let randomHexIndex = Math.floor(Math.random() * potential.length);
      toReturn += potential.substring(randomHexIndex, randomHexIndex + 1);
    }

    return toReturn;
  }

  // Checks which algorithim to start, based on selection
  startRespectiveAlgorithim() {
    if (this.state.algorithim == this.stateEnum.KMEANS)
      this.setState({ choosingCentroidState: true, readyToStartState: false });
    if (this.state.algorithim == this.stateEnum.DBSCAN) {
      this.runDBScan();
      this.setState({ runningDBScan: true, readyToStartState: false });
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

  // Restarts DBScan by making all points unlabeled again
  unclusterData() {
    let unlabeled = this.state.unlabeledData;
    let outliers = this.state.centroidData;
    let clusters = this.state.clusteredData;

    for (let cluster of clusters) {
      for (let point of cluster) {
        unlabeled.push({ x: point.x, y: point.y });
      }
    }

    for (let outlier of outliers) {
      unlabeled.push({ x: outlier.x, y: outlier.y });
    }

    this.setState({
      centroidData: [],
      clusteredData: this.generateEmptyCluster(),
      unlabeledData: unlabeled
    });
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
      <Nav.Link onClick={() => this.checkCentroidPick()}>
        <Image src={Check} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showRunNextIterationBar() {
    return this.state.runningKMeans ? (
      <Nav.Link onClick={() => this.runIteration()}>
        <Image src={Forward} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showClearSlateBar() {
    return this.state.runningKMeans || this.state.runningDBScan ? (
      <Nav.Link onClick={() => this.clearSlate()}>
        <Image src={Eraser} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showResetClusterBar() {
    return this.state.runningDBScan ? (
      <Nav.Link onClick={() => this.unclusterData()}>
        <Image src={Reset} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showRunDBScanAgainBar() {
    return this.state.runningDBScan ? (
      <Nav.Link onClick={() => this.runDBScan()}>
        <Image src={Reset} />
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

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showClusteringNavBar()}
          <Row>
            <XYPlot
              width={600}
              height={600}
              onClick={e => this.smallClusterDrop(e)}
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
            {this.showClusterDeploymentSelectionBar()}
            {this.showDBScanSelectionBar()}
          </Row>
        </div>
      </div>
    );
  }
}

export default Clustering;
