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
import KNNLearn from "./learn/KNNLearn";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { generateRandomData } from "./algorithims/KNNAlgo";
import { euclidFunction, comparator, arrayRange } from "../Utility";
import "../css_files/App.css";
import {
  showBackToAlgorithimPage,
  displayInfoButton,
  showLearnModeIcon
} from "../Utility";

class KNN extends React.Component {
  constructor(props) {
    super(props);

    this.stateEnum = {
      POSITIVE: "#32CD32",
      NEGATIVE: "#FF6347",
      UNLABELED: "#FFFFFF",
      HIGHLIGHT: "#FFFF00"
    };

    let randomData = generateRandomData();

    this.state = {
      k: 1,
      positiveData: randomData.positive,
      negativeData: randomData.negative,
      showLearnMode: false,
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

  // Labels data as either positive or negative based on the state array that
  // it orginally belongs to
  relabelData(point) {
    point["class"] = this.state.positiveData.includes(point)
      ? this.stateEnum.POSITIVE
      : this.stateEnum.NEGATIVE;
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

  // Highlights K on mouse over or determines point on click
  highlightK(datapoint, isChange) {
    let highlightPoints = [];
    let newPositive = this.state.positiveData;
    let newNegative = this.state.negativeData;
    let newUnlabeled = this.state.undeterminedData;
    let allData = this.state.positiveData.concat(this.state.negativeData);
    allData = allData.map(point => this.relabelData(point));
    let euclidMap = allData.map(point => euclidFunction(point, datapoint));
    euclidMap.sort(comparator);
    let positiveCount = 0;

    for (let i = 0; i < this.state.k; i++) {
      highlightPoints.push(euclidMap[i].orginalPoint);
      positiveCount +=
        euclidMap[i].orginalPoint.class === this.stateEnum.POSITIVE ? 1 : 0;
    }

    if (isChange) {
      if (positiveCount >= this.state.k / 2) {
        newPositive.push(datapoint);
      } else {
        newNegative.push(datapoint);
      }
      newUnlabeled.splice(newUnlabeled.indexOf(datapoint), 1);
      highlightPoints = [];
    }

    this.setState({
      positiveData: newPositive,
      negativeData: newNegative,
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
    const newRandomized = generateRandomData();

    this.setState({
      positiveData: newRandomized.positive,
      negativeData: newRandomized.negative
    });
  }

  showRandomizeUndeterminedDataButton() {
    return this.state.positiveData.length > 0 && !this.state.showLearnMode ? (
      <Nav.Link onClick={() => this.generateRandomUndetermined()}>
        <Image src={Shuffle} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showRandomizeDataButton() {
    return !this.state.showLearnMode ? (
      <Nav.Link onClick={() => this.randomizeData()}>
        <Image src={Shuffle} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showAddButton() {
    return this.state.positiveData.length > 0 && !this.state.showLearnMode ? (
      <Nav.Link
        onClick={() =>
          this.addPoint(this.refs["xCoord"].value, this.refs["yCoord"].value)
        }
      >
        <Image src={Add} style={{ width: 40 }} />
      </Nav.Link>
    ) : null;
  }

  showXandYInputBar() {
    return this.state.positiveData.length > 0 && !this.state.showLearnMode
      ? this.showXandYInput()
      : null;
  }

  showKSelection() {
    return this.state.undeterminedData.length > 0 && !this.state.showLearnMode
      ? this.showKSelect()
      : null;
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
        {showLearnModeIcon(this)}
      </Navbar>
    );
  }

  showLearnKNN() {
    return this.state.showLearnMode ? <KNNLearn /> : null;
  }

  displayKNNExperiement() {
    return !this.state.showLearnMode ? (
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
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="0.8"
            sizeRange={[0, 100]}
            color={this.stateEnum.POSITIVE}
            data={this.state.positiveData}
          />
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="0.8"
            sizeRange={[0, 100]}
            color={this.stateEnum.NEGATIVE}
            data={this.state.negativeData}
          />
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
    ) : null;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.showKNNNavBar()}
          {this.displayKNNExperiement()}
          {this.showLearnKNN()}
        </div>
      </div>
    );
  }
}

export default KNN;
