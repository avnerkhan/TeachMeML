import React from "react";
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
import Add from "../Images/add.png";
import {
  Nav,
  FormControl,
  InputGroup,
  Form,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { generateRandomData } from "./algorithims/KNNAlgo";
import { euclidFunction, comparator, arrayRange } from "../Utility";
import "../css_files/App.css";
import { showBackToAlgorithimPage, displayInfoButton } from "../Utility";
import { connect } from "react-redux";

class KNN extends React.Component {
  constructor(props) {
    super(props);

    this.stateEnum = {
      UNLABELED: "#FFFFFF",
      HIGHLIGHT: "#FFFF00"
    };

    let randomData = generateRandomData(30, 100, this.props.labels);

    this.state = {
      k: 1,
      labeledData: randomData,
      undeterminedData: [],
      currentHighlightData: []
    };
  }

  // Adds an undetermined point to the grid
  addPoint(xCoord, yCoord) {
    xCoord = parseInt(xCoord);
    yCoord = parseInt(yCoord);

    if (!isNaN(xCoord) && !isNaN(yCoord)) {
      let updatedDataUndetermined = this.state.undeterminedData;
      updatedDataUndetermined.push({ x: xCoord, y: yCoord });

      this.setState({
        undeterminedData: updatedDataUndetermined
      });
    } else {
      alert("Please enter valid coordinates");
    }

    this.refs["xCoord"].value = "";
    this.refs["yCoord"].value = "";
  }

  findCorrelatedColor(point) {
    const labeledData = this.state.labeledData;
    for (const key in labeledData) {
      if (labeledData[key].includes(point)) return key;
    }
    return null;
  }

  // Labels data as either positive or negative based on the state array that
  // it orginally belongs to
  relabelData(point) {
    console.log(point);
    point["class"] = this.findCorrelatedColor(point);
    return point;
  }

  // Returns JSX for showing the input for x and y
  showXandYInput() {
    return (
      <Nav.Link>
        <InputGroup>
          <FormControl ref="xCoord" placeholder="Enter X Coordinate" />
          <FormControl ref="yCoord" placeholder="Enter Y Coordinate" />
        </InputGroup>
      </Nav.Link>
    );
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

  getAllData() {
    let allData = [];
    const labeledData = this.state.labeledData;

    for (const color in labeledData) {
      const currentList = labeledData[color];
      for (const point of currentList) {
        allData.push(point);
      }
    }

    return allData;
  }

  // Highlights K on mouse over or determines point on click
  highlightK(datapoint, isChange) {
    let highlightPoints = [];
    let newData = this.state.labeledData;
    let newUnlabeled = this.state.undeterminedData;
    let allData = this.getAllData();
    allData = allData.map(point => this.relabelData(point));
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

  generateRandomUndetermined(length = 20, max = 100) {
    for (let i = 0; i < length; i++) {
      const randomX = Math.floor(Math.random() * max);
      const randomY = Math.floor(Math.random() * max);
      this.addPoint(randomX, randomY);
    }
  }

  randomizeData() {
    const newRandomized = generateRandomData(30, 100, this.props.labels);

    this.setState({
      labeledData: newRandomized
    });
  }

  showRandomizeUndeterminedDataButton() {
    return Object.keys(this.state.labeledData).length > 0 ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate random undetermined points</Tooltip>}
      >
        <Nav.Link onClick={() => this.generateRandomUndetermined()}>
          <Image src={Shuffle} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showRandomizeDataButton() {
    return (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Generate random labeled data</Tooltip>}
      >
        <Nav.Link onClick={() => this.randomizeData()}>
          <Image src={Shuffle} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    );
  }

  showAddButton() {
    return Object.keys(this.state.labeledData).length > 0 ? (
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={<Tooltip>Add a point</Tooltip>}
      >
        <Nav.Link
          onClick={() =>
            this.addPoint(this.refs["xCoord"].value, this.refs["yCoord"].value)
          }
        >
          <Image src={Add} style={{ width: 40 }} />
        </Nav.Link>
      </OverlayTrigger>
    ) : null;
  }

  showXandYInputBar() {
    return Object.keys(this.state.labeledData).length > 0
      ? this.showXandYInput()
      : null;
  }

  showKSelection() {
    return this.state.undeterminedData.length > 0 ? this.showKSelect() : null;
  }

  showKNNNavBar() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        {showBackToAlgorithimPage()}
        {this.showAddButton()}
        {this.showRandomizeUndeterminedDataButton()}
        {this.showRandomizeDataButton()}
        {this.showXandYInputBar()}
        {this.showKSelection()}
      </Navbar>
    );
  }

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

  displayKNNExperiement() {
    return (
      <div>
        {displayInfoButton(
          "KNN Plot",
          "Use the bar above to add your own coordinates to the grid. All undetermined datapoints are black, and there are only two classes. The first shuffle button randomizes determined data, while the second shuffle button places random undetermined points. Hover your mouse over an undetermined point to see which points that it will use nearby to determine, and press on the point to determine.",
          "left"
        )}
        <XYPlot width={600} height={600}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          {this.showLabeledMarkSeries()}
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
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="0.8"
            sizeRange={[0, 100]}
            color={this.stateEnum.HIGHLIGHT}
            data={this.state.currentHighlightData}
          />
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
